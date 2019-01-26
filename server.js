var express = require('express');
var app = express();
const fs = require('fs')

const maxRead = 150

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res)=>{
  //res.send('locked')
  res.sendFile(__dirname + '/app/index.html');
});

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
              //if (!ri) console.log('exc 0', results[id].excerpts[0])
              return id
            }
          }).filter(x=>x)

          const finals = keysWResults.map(id=>{
            //console.log('     id w vids',id)
            results[id].id = id
            return results[id]
          })

          allResults.push({channel: dir, expt:finals})
          //return finals
          //console.log(results, 'result !!!!! ')
          // allResults.push(...results)
        })
        await Promise.all(readPromises)
        console.log('\n\n')

        res.end(JSON.stringify(allResults))


    })
})

app.post('/nowords', async (req,res)=>{
  const empty = await getEmptyVideosFromLists()
  console.log('no words', empty)
  res.send(empty)
})

//app.listen(6707, ()=>console.log('server on 6707'))
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function getAllDirs(){
    const path = process.cwd() + '/channel_data/' // + (channel || 'Coding train')
    const dirs = fs.readdirSync(path) //, (er, dirs)=>{

    console.log('dirs',dirs,'\n')
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
        console.log(channel, 'files filtered', files.length)

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

                      let time = fullTextIndices[fromI]!==undefined ? fullTextIndices[fromI] : fullTextIndices[fromI+1] // prevent undefined times
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
                results[videoid] = { excerpts: uniqueMatches, title: dataRaw.title }

                if (filesRead==0) resolve(results)
            })
        })
      })
  })
}


function writeCapsFile(data, path){
  return new Promise((resolve, reject)=>{
    
    // convert every time info to seconds since thats used in YT url with time info
    timeInfoToSeconds(data)
    //console.log(data.times.length, data.cc.length)

    // give every word its timecode in seconds
    const words = []
    data.cc.map((piece,i)=>{
        const pieceWords = piece.split(/ /g)
        const seconds = data.times[i]

        const mapped = pieceWords.map(w=>[w, seconds])
        words.push(...mapped)
    })

    //data.text_merged = data.cc.join(' ')
    const newData = {title: data.title, fromid: data.fromid, words}
    
    
    fs.writeFile(path, JSON.stringify(newData), er =>{ 
        if (er) console.log(er, 'err writing file')
        else console.log('file saved', data.fromid)

        resolve(200)
    })
  })
}

// i only send floored seconds from extension = no decimals
function timeInfoToSeconds(data){
  
  if (!data.times || !data.times.length) {
    console.log(' - - - - - -    no data.times    - - - - - - !!!')
    return data;
  }

  data.times = data.times.map((string, i)=>{
      const nums = string.split(/:/g).reverse().map(str=>parseInt(str))

      //if (i==3 || i == 60 ) console.log(nums)
      if (nums[2]) nums[2] = nums[2]*60 // make it minutes already

      const secondsTotal = nums
      .filter((n,i)=>!!i) // convert only minutes and hours to seconds
      .reduce((tot, curr)=> tot+curr*60,nums[0])

      return secondsTotal
  })
}



async function getEmptyVideosFromLists(){
  return new Promise((resolve)=>{
  
  fs.readdir('empty_lists',async (er, files)=>{
    console.log(files)
    //files = files.map(name=> name.replace(/()/, '$1'))
    files = files.map(name=>{
      return new Promise((resolve)=>{
        const channel = name.replace(/_\d+_\d+_\d+\.json$/, '')
        fs.readFile('empty_lists/' + name, (er, data)=>resolve({
            channel,
            empty_videos: JSON.parse(data)
          })
        )
      })
    })
    return await Promise.all(files)
  })
  })
}

async function scanFilesOld(){
  const path = process.cwd() + '/channel_data/'
        
  const dirs = await getAllDirs()
    
  let dirResults = dirs.map((dir)=>{
    return new Promise((resolve, reject)=>{
    
        const path = process.cwd() + '/channel_data/' + dir

        fs.readdir(path, async (er, files)=>{
          if (er) return console.log(er)

          const emptyFiles = []
          const emptyIds = []
          
          files = files
          .filter(name=>!name.match(/^(\.DS_Store|_empty|_err|_nocaps|_nocontrib)$/i)) // filter out foldernames
          .filter(name=>name.match(/\.json$/))

          const fileProms = files.map((file,i)=>{
              return new Promise((resolve, reject)=>{
                fs.readFile(path + '/' + file, 'utf8', (er, data)=>{
                    data = JSON.parse(data)

                    if (! data.words.length || !data.words.every(word=>word[0])) {
                      //console.log('      title', data.title)
                      emptyFiles.push(data.title)
                      emptyIds.push(data.fromid)
                    }
                    resolve()
                })
              })
          })

          await Promise.all(fileProms)

          resolve({
             channel: dir,
             names: emptyFiles,
             ids: emptyIds
          })
      })
    })
  })
  dirResults = await Promise.all(dirResults)
  
  console.log('dir results', dirResults)
}