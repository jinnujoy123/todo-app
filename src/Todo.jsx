import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from '@mui/material';
import { FaEye } from "react-icons/fa";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {addTodoAPI, deleteAPI, editTodoAPI, getTodoAPI} from './services/allAPI'

const style = {
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
width: 400,
bgcolor: 'background.paper',
border: '2px solid #0000003d',
boxShadow: 24,
p: 4,
}; 

function Todo() {
    const [todo,setTodo]=React.useState({title:"",description:"",date:"",priority:"",completed:'false'})
    const [allTodos,setAllTodos]=React.useState([])
    const [open, setOpen] = React.useState(false);
    const [edit,setEdit]=React.useState(false)
    const [editId,setEditId]=React.useState("")

  const handleOpen = () =>setOpen(true); 
  const handleClose = () => setOpen(false);
  
  React.useEffect(()=>{
  getTodo()
  },[])
const getTodo= async()=>{
  try{
const result=await getTodoAPI() 
 setAllTodos(result)
//  console.log(result);
}catch(err){
  console.log(err);    
} 

} 

// console.log(allTodos);

  const addTodo=async()=>{

  if(editId!=""){
    await editTodoAPI(todo,editId)
   
    const updatedTodo= allTodos.map((item)=>
      item.id === editId  ? { ...todo, id: editId } : item
    )
    console.log(updatedTodo);
      
       setAllTodos(updatedTodo);

       console.log(allTodos);
       
       setEditId(null);
       setEdit(false)
        setTodo({ title: "", description: "", date: "", priority: "" });
       
  }else{
      try{
    if(todo.title && todo.date && todo.priority ){
      await addTodoAPI(todo)
      setAllTodos([...allTodos,todo])     
      setTodo({title:"",description:"",date:"",priority:""})
      console.log(todo.completed);
      
    }
    else{
        alert("Please fill all the details")
    } 

  }catch(err){
    console.log(err);    
  }
  }
  }

const handleEdit=(todo,id)=>{
 setEdit(true)
 setEditId(id)
 setTodo(todo)
 
}


const handleDelete=async(id)=>{
try{
  await deleteAPI(id)
  getTodo()
}catch(err){
  console.log(err);
  
}
}
 

  return (
    <div className='todo py-5 vh-100'>
      <h1 className='text-center text-light'>TODO APP</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-6 ">
                <div className="bg-light d-flex flex-column p-5 rounded border shadow mt-5">


                    <input onChange={(e)=>
                        setTodo({...todo,title:e.target.value})                      
                    } type="text" placeholder='Task Title' className='p-2 border rounded ' value={todo.title}/>

                    <TextField id="standard-basic" label="Task Description (optional)" variant="standard" onChange={(e)=>setTodo({...todo,description:e.target.value})} value={todo.description}/>

                    <div className="date my-4">
                        <label htmlFor="" className='me-2'>Due Date   </label>
                        <input onChange={(e)=>setTodo({...todo,date:e.target.value})} type="date" value={todo.date} className='border rounded text-secondary p-2' />
                    </div>                   
                     <div>
                
                <select onChange={(e)=>setTodo({...todo,priority:e.target.value})} as="select" value={todo.priority} name="course" className="input me-4 text-secondary ">
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>           
                </select>
                

                
              </div>
               <button onClick={addTodo} className='btn btn-primary border rounded shadow my-4 w-25'>{edit ?'SAVE CHANGES':'ADD'}</button>
                </div>
            </div>
            <div className="col-md-6">
                            <ul className='my-5'>
                  { 
                
                   allTodos?.map((item,id)=>(
                        <>
                     
                                <div className="d-flex mt-2">
                                    <div key={id} className="d-flex flex-row w-100 border rounded justify-content-between p-2 align-items-center bg-light mb-2">
                                        <li className='fs-5'><input type="checkbox"  className='mx-2 '/>{item.title}</li>
                                       
                                        <div className="">
                                            <Button className='text-dark fs-4' onClick={handleOpen}><FaEye /></Button>
                                            <Button className=' fs-4' onClick={()=>handleEdit(item,item.id)}><FaEdit/></Button>
                                            <Button onClick={()=>{handleDelete(item.id)}} className='text-danger fs-4'>
                                             <MdDelete />
                                            </Button>
                                         
                                            
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {item.title}
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {item.description}     
          </Typography>
           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
           Due Date : {item.date}     
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Priority : {item.priority}        
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Status : <span className='text-success'>In-Progress</span>       
          </Typography>
        </Box>
      </Modal>

                                        </div>
                                        
                                    </div>
                                </div>
                        </>
                  ))
}
                            </ul>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Todo
