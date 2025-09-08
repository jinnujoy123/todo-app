import axios from "axios"

const BASEURL = "https://todo-server-cxjt.onrender.com/"

const commonAPI =async (httpMethod,url,reqBody)=>{
   
    const reqConfig={
        method:httpMethod,
        url,
        data:reqBody
    }
   
    //api call- axios(reqConfig)- to create instance of axios
    return await axios(reqConfig).then(res=>{
        return res.data
    }).catch(err=>{
        return err
    })
       
}

// CREATE
  export  const addTodoAPI= async(todo)=>{
       return await commonAPI("POST",`${BASEURL}todos`,todo)
    }


// READ 
export const getTodoAPI=async()=>{
    return await commonAPI("GET",`${BASEURL}todos`,{})
}


// UPDATE 
export const editTodoAPI=async(todo,id)=>{
    return await commonAPI("PUT",`${BASEURL}todos/${id}`,todo)
}
// DELETE 

export const deleteAPI=async(id)=>{
    return await commonAPI("DELETE",`${BASEURL}todos/${id}`,{})
}
