
function confirmDelete(value){
  const isConfirmed = confirm("確定要刪除嗎")

  if(isConfirmed){
    document.getElementById(`deleteForm${value}`).submit(value)
  }else{

  }
}