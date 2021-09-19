import React , {useEffect , useRef , useCallback} from 'react'
import Quill  from 'quill'
import "quill/dist/quill.snow.css"


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
        new Quill(editor , {theme : "snow" , modules : {toolbar : TOOLBAR_OPTIONS}})
        // return () => {// for the cleanup of the old toolbars after each render
        //     wrapRef.innerHTML = "";
        //     // if we don't do this then the old toolbars will persist
            
        // }

    } , [])
    //we need to wrap all are toolbars in one container as after each render 
    //we have to clean all the old toobars.
    
    return (
        <div className = "container" ref = {wrapRef}></div>
    )
}
