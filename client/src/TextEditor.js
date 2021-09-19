import React , {useEffect , useRef} from 'react'
import Quill  from 'quill'
import "quill/dist/quill.snow.css"

export default function TextEditor() {
    const wrapRef = useRef();
    useEffect(() => {
        const editor = document.createElement('div');
        wrapRef.current.append(editor); // wrapperRef.current point to the div on the 
        //first line of return
        // so if we pass editor to that div then all the toolbars will be put in the div container.
        //rest check in inspect
        new Quill("#container" , {theme : "snow"})


        return () => {// for the cleanup of the old toolbars after each render
            wrapRef.innerHTML = "";
            // if we don't do this then the old toolbars will persist
            // -----------------------
        }

    } , [])
    //we need to wrap all are toolbars in one container as after each render 
    //we have to clean all the old toobars.
    
    return (
        <div id = "container" ref = {wrapRef}></div>
    )
}
