const express = require('express');
const app = express();
const fs = require('fs')

const maxRead = 150
let logInfo = []


app.use(express.static('public'));



/*const allowCrossDomain = function(req, res, next) {
  //https://cloud-sublime.glitch.me/
  res.header('Access-Control-Allow-Origin', 'https://cloud-sublime.glitch.me');
  res.header('Access-Control-Allow-Methods', 'GET'); //,PUT,POST,OPTIONS
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  //if ('OPTIONS' == req.method) res.sendStatus(200);
  //if (req.query.key == 'masterplan')
  //else next();
  next()
};*/

//app.use(allowCrossDomain);


app.get('/', (req, res)=>{
    //res.send('locked')
    res.sendFile(__dirname + '/app/index.html');
});

app.get('/logs', (req,res,next)=>{

  //console.log(req, Object.keys(req))
  
  if (req.query.key!=='somethingbig') res.sendStatus(404)
  else next()

}, (req,res)=>{
  console.log('req.origin', req.origin)
  fs.readFile(process.cwd() + '/logs.json', 'utf8', (er, data)=>{
    if (er) {
      console.error(er)
      res.send('notok')
      res.end()
    } else{
      console.log('data', typeof data, data)
      res.send(data)
      res.end()
    }
  })
})

app.get('/dirs', async (req, res)=> {
    const dirs = await getAllDirs()
    res.send(dirs)
    res.end()
})
app.post('/searchtext', async (req,res)=>{
    console.log('request', req.query)
    let data = ''
    req.setEncoding('utf8')
    req.on('data', chunk=>{ data+=chunk })
    req.on('end',async ()=>{

        data = JSON.parse(data)
        console.log('search', data, data.query)

        logInfo.push({
          d: new Date(),
          s: data.query.toString(),
          ch: req.query.channels
        })
      
        // verify that query is harmless

        const allResults = []

        const desiredDirs = req.query.channels
        let dirs = getAllDirs()
        dirs = dirs.filter(dir=>desiredDirs.includes(dir))

        const readPromises = dirs.map(async (dir, dI)=>{
          let results = await searchFilesinDir(dir, data.query)

          if (!results) {
            //console.log(dir, 'results', results)
            return null
          }
          //struct: results[videoid] = { excerpts: uniqueMatches, title: title }

          const keysWResults = Object.keys(results).map((id,ri)=>{
            
            if (results[id].excerpts.length) {
              return id
            }
          }).filter(x=>x)

          const finals = keysWResults.map(id=>{
            //console.log('     id w vids',id)
            results[id].id = id
            return results[id]
          })

          allResults.push({channel: dir, expt:finals})
        })
        await Promise.all(readPromises)
        

        res.end(JSON.stringify(allResults))


    })
})

app.post('/nowords', async (req,res)=>{
  const empty = await getEmptyVideosFromLists()
  res.send(empty)
})

//app.listen(6707, ()=>console.log('server on 6707'))
const listener = app.listen(process.env.PORT, ()=>{
  console.log('on port ' + process.env.PORT);
});


//let timer = setInterval(saveLogs, 59000) // glitch sleeps in 5 min


function saveLogs(){
  if (!logInfo.length) return console.log('nothing to log');
  
  fs.readFile('logs.json', 'utf8',(er, data)=>{
    
    data = JSON.parse(data)
    console.log('log data length',data.length)
    data.push(...logInfo)
    fs.writeFile('logs.json', JSON.stringify(data), (er)=>{
      if (er)console.log(er)
      else logInfo = []
    })
  })
}

function getAllDirs(){
    const path = process.cwd() + '/channel_data/' // + (channel || 'Coding train')
    const dirs = fs.readdirSync(path)

    if (!dirs.length) {
      console.log('no dirs')
      //res.sendStatus(404)
    }
    return dirs.filter(name=>!name.match(/^(\.DS_Store|_template)$/i))
}

function searchFilesinDir(channel, string){
  return new Promise((resolve, reject)=>{
      
      const path = process.cwd() + '/channel_data/' + channel

      fs.readdir(path, (er, files)=>{
        //console.log('files',files)

        files = files.filter(name=> !name.match(/^(_nocaps|_nocontrib|_err|_empty|\.DS_Store)$/i) ) // these are folders keeping wrong results
        //console.log(channel, 'files filtered', files.length)

        if (!files.length) {
          //console.log('no files')
          return resolve(null) //reject('no files')
        }

        let filesRead = files.length
        const results = {}
        files.map((f,i)=>{
          const videoid = f.replace(/.json$/, '').replace(/(_nocontrib_|_nocaps_)/ig, '')
          const pathFile = path + '/' + files[i]
          

            fs.readFile( pathFile , 'utf8', (er, data) =>{
                if (er) console.log('ERROR',pathFile)
                
                filesRead--;
                const dataRaw = JSON.parse(data)

                const fullTextIndices = {}

                let fulltext = ''
                dataRaw.words.map((curr,j)=>{
                    //if (j<10) console.log('fulltext.length',fulltext.length)
                    if (j) fulltext += ' '
                    // get indice of where current word will be placed into fulltext
                    const I = fulltext.length
                    fulltext += curr[0]
                    //if (j<15) 
                    fullTextIndices[I] = curr[1]
                })
                fulltext = fulltext.trim()
                while (fulltext.match(/  /g)){  // prevent undefined times of excerpts: ' Some sentence ...' it mostly happens bcs of this
                  fulltext = fulltext.replace(/  /g, ' ')
                }
                
                // create map of timecodes for fulltext
                //  each first letter of word is saved as indice and gets timecode num, other letters get nothing


                // get occurences of string and their timecodes
                const indices = []

                const wordlen = string.length
                let fromInd = 0


                // get all indices where requested string occurs
                while (fulltext.indexOf(string, fromInd)>-1 && indices.length<1000 ) {
                //while (match && indices.length<100 ) {

                    const atI = fulltext.indexOf(string, fromInd)

                    if (atI > -1) {
                      indices.push(atI)  // store all indices where string occured
                      fromInd = atI + wordlen
                    }
                    //console.log(' at', atI)
                    
                    //prev = indices[indices.length-1] ? indices[indices.length-1] : 0
                    //const xx= copy.indexOf(string, ind)
                    //indices.push(xx)
                    // indices.push(match.index + prev)
                    // console.log('prev ind', prev, match.index + prev)

                    // copy = copy.substring(match.index + string.length)// , copy.length)
                    // match = re.exec(copy)
                    // if (match) console.log('   ',match.index, 'kjhkjkjkjb')
                }
                const punctuation = /\.|\?|\!/

                const matchesExcerpts = indices.map(num=>{
                      
                      let fromI = null, tillI = null
                      
                      // find start of sentence - to get a bit of context
                      for (let i=num; i>=0; i--){

                        // prevent the sentence to be too long
                        if ( i <= num-maxRead ){
                            let j = i
                            // find soonest empty space char
                            while(fulltext[j] && fulltext[j]!==' '){
                              j--
                            }
                            fromI = j+1;
                            //console.log('   test char>' + fulltext.substring(fromI, fromI+50))
                            //console.log('     test char>' + fulltext[fromI])
                            //console.log(fullTextIndices[fromI-1], fullTextIndices[fromI], fullTextIndices[fromI+1], fullTextIndices[fromI+2])
                            break;
                        }
                        else if (punctuation.test(fulltext[i]) ){
                          fromI = i+1;
                          break;
                        }
                      }
                      fromI = fromI === null ? 0 : fromI

                      // find end of sentence or where to cut off
                      for (let i=num; i<fulltext.length; i++){

                        // prevent sentence from being too long, get it then only till next empty space after buffer
                        if ( i >= num+maxRead ){
                            let j = i
                            while(fulltext[j]!==' '){
                              j++
                            }
                            tillI = j;
                            break;
                        }
                        else if (punctuation.test(fulltext[i])){
                          tillI = i+1;
                          break;
                        }
                      }
                      tillI = tillI === null ? fulltext.length : tillI

                      let time = fullTextIndices[fromI] || fullTextIndices[fromI+1] ||
                                 fullTextIndices[fromI+2] || fullTextIndices[fromI+3] ||
                                 fullTextIndices[fromI+4] // prevent undefined times
                      //console.log('    time', time, '\n\n')


                      return { time, text: fulltext.substring(fromI, tillI), fromI } 
                })
                
                // keep only unique ones (sometimes sentence gets back few times, bcs searched word is there twice or more )
                // const uniqueMatches = matchesExcerpts /*[]
                
                // get rid of copies
                // enough different excerpts have different times from each other
                // example:   all heard or most of you probably heard, about embeddings like word embeddings word to their core glove or whatever and People love to make them sound, like this Amazing, new complex neural net thing
                //            probably heard, about embeddings like word embeddings word to their core glove or whatever and People love to make them sound, like this Amazing, new complex neural net thing right they're not embedding
                // 'copies' dont have time info now
                const mWithTimes = matchesExcerpts.filter(expt=>{ 
                  //console.log('tiiime', expt.time); 
                  return typeof expt.time == 'number'
                })

                //console.log(mWithTimes, '\nonly w times\n')
                const uniqueMatches = [] //matchesExcerpts
                matchesExcerpts.map(expt=>{
                    //if (!uniqueMatches.some(m=>m.text === expt.text)) uniqueMatches.push(expt)
                    if (!uniqueMatches.length) uniqueMatches.push(expt) // rest of code wont work for very first one

                    
                    const lastExcpt = uniqueMatches[uniqueMatches.length-1] // they are created together

                    // keep first one, other almost identical results are not needed
                    
                    if (typeof expt.time == 'number' && lastExcpt.time !== expt.time) uniqueMatches.push(expt)
                    
                })
                //console.log('    ', matchesExcerpts.length,'->', uniqueMatches.length)

                // exrpts from one video
                results[videoid] = { excerpts: uniqueMatches, title: dataRaw.title, uploaded: dataRaw.uploaded }

                if (filesRead==0) resolve(results)
            })
        })
      })
  })
}


async function getEmptyVideosFromLists(){
  return new Promise((resolve)=>{
  
    fs.readdir('empty_lists',async (er, files)=>{
      files = files
      .filter(name=>!name.match(/^(\.DS_store|Jeremy Howard_2019_1_27.json)$/i))
      .map(name=>{
        return new Promise((resolve)=>{
          const channel = name.replace(/_\d+_\d+_\d+\.json$/, '')
          fs.readFile('empty_lists/' + name, (er, data)=>{
            data = JSON.parse(data)
            // get unique video info, no duplicates
            const uniq = [] // files contain duplicities (at least in Coding train), idk why currently
            data.map(oldvid=>{ 
              if (!uniq.find(video=> video.title === oldvid.title) ) uniq.push(oldvid)
            })

            resolve({
              channel,
              empty_videos: uniq //Array.from(new Set(data))
            })
          })
        })
      })
      files = await Promise.all(files)
      const uniqFiles = Array.from(new Set(files))
      //console.log('files -> uniq',files.length, uniqFiles.length)

      resolve( uniqFiles)
    })
  })
}
