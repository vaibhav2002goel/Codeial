const path = require('path');
const env = require('./environment')
const fs = require('fs')


module.exports =(app)=>{
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return filePath;
        }
        let fileType = filePath.substring(filePath.length-3, filePath.length)
        // console.log(filePath,'*********',fileType)
        if(fileType == 'css'){
            let x =  '/css/' + JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath]
            return x;
        }

        let y = '/' + JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath]
        return y
    }
}