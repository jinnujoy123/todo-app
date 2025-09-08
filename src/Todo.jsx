import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "@mui/material";
import { FaEye } from "react-icons/fa";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  addTodoAPI,
  deleteAPI,
  editTodoAPI,
  getTodoAPI,
} from "./services/allAPI";
import swal from 'sweetalert';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #0000003d",
  boxShadow: 24,
  p: 4,
};

function Todo() {
  const [todo, setTodo] = React.useState({
    title: "",
    description: "",
    date: "",
    priority: "",
    completed: false,
  });
  const [allTodos, setAllTodos] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [editId, setEditId] = React.useState("");
  const [selectedTodo, setSelectedTodo] = React.useState(null);
  const [filter,setFilter]=React.useState('all')

  const handleOpen = (id) => {
    const selectedTodo = allTodos.find((item) => item.id === id);
    setSelectedTodo(selectedTodo);
    setOpen(true);
    console.log(selectedTodo);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  React.useEffect(() => {
    getTodo();
  }, []);
  const getTodo = async () => {
    try {
      const result = await getTodoAPI();
      setAllTodos(result);
      //  console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(allTodos);

  const addTodo = async () => {
    if (editId != "") {
      await editTodoAPI(todo, editId);
      const updatedTodo = allTodos.map((item) =>
        item.id === editId ? { ...todo, id: editId } : item
      );
      // console.log(updatedTodo);
      setAllTodos(updatedTodo);   
      setEditId(null);
      setEdit(false);
      setTodo({ title: "", description: "", date: "", priority: "" });
    } else {
      try {
        if (todo.title && todo.date && todo.priority) {
          await addTodoAPI(todo);
          setAllTodos([...allTodos, todo]);
          setTodo({ title: "", description: "", date: "", priority: "" });
        } else {
          alert("Please fill all the details");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (todo, id) => {
    setEdit(true);
    setEditId(id);
    setTodo(todo);
  };

const handleDelete = (id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this task!",
    icon: "warning",
    buttons: ["Cancel", "Delete"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
          deleteAPI(id)
        .then(() => {
          getTodo(); 
          swal("Task has been deleted!", { icon: "success" });
        })
        .catch((err) => {
          console.error(err);
          swal("Something went wrong!", { icon: "error" });
        });
    }
  });
};

  const toggleComplete = async (id, checked) => {
    // Update local state
    const updatedTodos = allTodos.map((item) =>
      item.id === id ? { ...item, completed: checked } : item
    );
    setAllTodos(updatedTodos);

    // Update server with full updated todo
    const updatedTodo = updatedTodos.find((t) => t.id === id);
    try {
      await editTodoAPI(updatedTodo, id);
    } catch (err) {
      console.log(err);
    }
  };

const filteredTodos = allTodos.filter((item) => {
  if (filter === "all") return true;
  if (filter === "pending") return !item.completed;
  if (filter === "completed") return item.completed;
  
  return true;
});

  return (
    <div className="todo py-5 ">
      <h1 className="title text-center ">TODO MASTER</h1>
      <h3 className="tagline text-center"> Your day , your tasks , your success...</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-6 ">
            <div className="bg-light d-flex flex-column p-5 rounded border shadow mt-5">
              <input
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                type="text"
                placeholder="Task Title"
                className="p-2 border rounded "
                value={todo.title}
              />

              <TextField
                id="standard-basic"
                label="Task Description (optional)"
                variant="standard"
                onChange={(e) =>
                  setTodo({ ...todo, description: e.target.value })
                }
                value={todo.description}
              />

              <div className="date my-4">
                <label htmlFor="" className="me-2">
                  Due Date{" "}
                </label>
                <input
                  onChange={(e) => setTodo({ ...todo, date: e.target.value })}
                  type="date"
                  value={todo.date}
                  className="border rounded text-secondary p-2"
                />
              </div>
              <div>
                <select
                  onChange={(e) =>
                    setTodo({ ...todo, priority: e.target.value })
                  }
                  as="select"
                  value={todo.priority}
                  name="course"
                  className="input me-4 text-secondary "
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button
                onClick={addTodo}
                className="btn add_btn border rounded shadow my-4 w-50"
              >
                {edit ? "SAVE CHANGES" : "ADD"}
              </button>
            </div>
          </div>
          <div className="col-md-6 text-center ">

           <div className="mt-5 d-flex justify-content-evenly icons ">
            <button className="rounded border shadow  text-light" onClick={()=>setFilter('all')} >All</button>
            <button className="rounded border shadow bg-success text-light" onClick={()=>setFilter('pending')}>Pending</button>
            <button className="rounded border shadow bg-warning text-light" onClick={()=>setFilter('completed')}> Completed</button> 
           </div>
           <h3 className="my-5 text-capitalize tasks">{filter} Tasks</h3>
            <ul className="mb-5 d-flex justify-content-center align-items-column flex-column w-100">
              {
             
             filteredTodos?.map((item, id) => (
                <>
                  <div className="d-flex mt-2 flex-column text-center">
                    <div
                      key={id}
                      className="d-flex flex-row w-100 border rounded justify-content-between align-items-center  mb-2" style={{backgroundColor:'white'}}
                    >
                      <li className="fs-5">
                        <input
                          type="checkbox"
                          checked={item.completed || false}
                          onChange={(e) =>
                            toggleComplete(item.id, e.target.checked)
                          }
                          className="mx-2"
                        />
                        <span
                          style={{
                            textDecoration: item.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.title}
                        </span>
                      </li>

                      <div className="">
                        <button
                          className="text-dark fs-md-4 fs-5"
                          onClick={() => handleOpen(item.id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className=" fs-4 me-2 ms-3 text-primary"
                          onClick={() => handleEdit(item, item.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(item.id);
                          }}
                          className="text-danger fs-4"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </ul>
        <div className="">
          {open && (
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h6">
                  <span className="text-primary">{selectedTodo.title}</span>
                </Typography>
                <Typography
                  id="modal-modal-description"
                  variant="p"
                  sx={{ mt: 2 }}
                >
                  {selectedTodo.description}
                </Typography>
                <Typography
                  id="modal-modal-description"
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Due date : {selectedTodo.date}
                </Typography>
                <Typography
                  id="modal-modal-description"
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Priority : {selectedTodo.priority}
                </Typography>
                <Typography
                  id="modal-modal-description"
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Status :{" "}
                  {selectedTodo.completed ? (
                    <span className="text-warning">Completed</span>
                  ) : (
                    <span className="text-success">In-progress</span>
                  )}
                </Typography>
              </Box>
            </Modal>
          )}
        </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Todo;
