var fs=require("fs")
//this.wordAfterRemoveStopWords =[]
//console.log(this._storageManager.data)
// if(!this.data.includes(word)){
//     this.wordAfterRemoveStopWords.push(word)
// } 

class StorageManager{
    dispatch(message){
        if(message[0]==="init")
        {
            this.init(message[1])
        }
        else if(message[0]==="words"){
            return   this.word()
        }
    }
    init(fileName){
        this.data =  fs.readFileSync(fileName).toString().split(" ");
       
    }
    word(){
        return this.data;
    }
}

class StopWordsManager{
    dispatch(message){
        if(message[0]==="init"){
            this.init()
        }else if(message[0]==='is_stop_word'){
            
            this.is_stop_word(message[1])
        }
        
    }
    init(){
        this.data =  fs.readFileSync('stopwords.txt').toString().split(",");
       
         return this.data;

    }
    is_stop_word(word){
        this.wordAfterRemoveStopWords =[]
        
        if(!this.data.includes(word)){
            this.wordAfterRemoveStopWords.push(word)
        } 
        return this.wordAfterRemoveStopWords
    }
}
 class WordFreqManager{
     dispatch(message){
         if(message[0]==="init"){
           this.init()
         }
        else if(message[0]==="incrementCount"){
             this.incrementCount(message[1])}
         else if(message[0]==="sorted"){
             return this.sorted()
         }
         
     }
     init(){
        this.storyAfterFreq=[]
     }
     incrementCount(word){
        let find =this.storyAfterFreq.find(x => x.key === word)
         if(find){
             find.count++
         }else{
             this.storyAfterFreq.push({key:word,count:1})
         }
        
     }
     sorted(){
       return  this.storyAfterFreq.sort((a,b) =>  b.count - a.count)
     }

}

class WordFrequencyController{
    dispatch(message){
       
        if(message[0]==="init"){
            this.init(message[1])
        }else{
            this.run()
        }
    }

    init(fileName){
        this._storageManager = new StorageManager()
        this._stopWordsManager = new StopWordsManager()
        this._wordFreqManager = new WordFreqManager()
        
         this._storageManager.dispatch(['init',fileName])
         this._stopWordsManager.dispatch(['init'])

         this._wordFreqManager.dispatch(['init'])


    }
    run(){
         let words = this._storageManager.dispatch(['words']);
        

         for(let i in words){
             if(this._stopWordsManager.dispatch(['is_stop_word',words[i]])==undefined){
                this._wordFreqManager.dispatch(['incrementCount',words[i]])
              
             } 
        
        }
        console.log( this._wordFreqManager.dispatch(['sorted']))
       
    }
}
let WFC = new WordFrequencyController;
WFC.dispatch(["init","story.txt"]);
WFC.dispatch(['run'])
