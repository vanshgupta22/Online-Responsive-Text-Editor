import React , {useEffect , useRef , useCallback , useState} from 'react'
import Quill  from 'quill'
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client';


const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"]
]

export default function TextEditor() {
    const [socket , setSocket] = useState();
    const [quill , setQuill] = useState();

    useEffect(() => {
        const s = io("http://localhost:5000");//connects with server
        setSocket(s);

        //return is used for cleanup when the component unmounts
        return () => {
            s.disconnect()
        }
    },[])

    useEffect(() => {//for transmitting text changes to all instances

        if(socket == null || quill == null)return;
        
        const handler = (delta) =>{
            quill.updateContents(delta)
        };

        socket.on('receive-changes', handler );

        return() =>{
            socket.off('receive-changes' , handler);
        }
    } , [socket , quill])

    useEffect(() => {//for text changes

        if(socket == null || quill == null)return;
        
        const handler = (delta, oldDelta, source) =>{
            if(source !== 'user')return;// if changes made using api then don't make it for someone else
            socket.emit("send-changes" , delta); // else make changes

        };

        quill.on('text-change', handler );

        return() =>{
            quill.off('text-change' , handler);
        }
    } , [socket , quill])



   // const wrapRef = useRef();
    //problem with useEffect : sometimes wrapRef is not defined before render starts
    //fix :  we use useCallback
    //use of useCallback : it only gets rendered when the content inside it changes
    // and not when whole parent function changes
   const wrapRef =  useCallback((wrapper) => {
       if(wrapper == null)return;
       wrapper.innerHTML = '';// for the cleanup of the old toolbars after each render
        const editor = document.createElement('div');
        wrapper.append(editor); // wrapperRef.current point to the div on the 
        //first line of return
        // so if we pass editor to that div then all the toolbars will be put in the div container.
        //rest check in inspect
        const q = new Quill(editor , {theme : "snow" , modules : {toolbar : TOOLBAR_OPTIONS}})
        // return () => {// for the cleanup of the old toolbars after each render
        //     wrapRef.innerHTML = "";
        //     // if we don't do this then the old toolbars will persist
            
        // }
        setQuill(q);

    } , [])
    //we need to wrap all are toolbars in one container as after each render 
    //we have to clean all the old toobars.
    
    return (
        <div className = "container" ref = {wrapRef}></div>
    )
}
