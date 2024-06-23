const express=require('express')
const bodyParser=require('body-parser')

const app = express()
app.use(bodyParser.json())

class Node{
    constructor(data){
        this.data=data;
        this.next=null;
        this.prev=null;
    }
}

class DLL{
    constructor(){
        this.head=null;
        this.tail=null;
        this.size=0;
    }

    enqueue(data){
        const newNode=new Node(data);
        if(!this.head){
            this.head=newNode;
            this.tail=newNode;
        }
        else{
            this.tail.next=newNode;
            newNode.prev=this.tail;
            this.tail=newNode;
        }
        this.size++;
    }
    
    peek(){
        if(!this.head){
            return null;
        }
        return this.head.data;
    }

    dequeue(){
        if(!this.head){
            return null;
        }else if(!this.head.next){
            const temp=this.head.data;
            this.head=null;
            this.tail = null;
            this.size--;
            return temp;
        }else{
            const temp=this.head.data;
            this.head=this.head.next;
            this.head.prev=null;
            this.size--;
            return temp;
        }
    }
}


const queue= new DLL();


app.post('/push',function(req,res){
    const data=req.body;
    console.log(data);
    queue.enqueue(data);
    res.status(200).json({ message:"Data Queued Successfully"});
})

app.get('/peek',function(req,res){
    const data=queue.peek();
    if(!data) res.status(200).json(null);
    else res.status(200).json(data);
});

app.get('/pop',function(req,res){
    const data=queue.dequeue();
    if(!data) res.status(200).json(null);
    else res.status(200).json(data);
});

app.get('/size',function(req,res){
    res.status(200).json({size: queue.size})
}); 

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})