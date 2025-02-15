import './style.css'

import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67afd1fe002789edc85c');

const databases = new Databases(client);

const form = document.querySelector('form');

form.addEventListener('submit', addJob)

function addJob(e){
  e.preventDefault();
  const job = databases.createDocument(
    '67b0078f0018d4b585c2',
    '67b008520018e7f21c67',
    ID.unique(),
    { 
      "company-name": e.target.companyName.value,
      "date-added": e.target.dateAdded.value,
      "role": e.target.role.value,
      "location": e.target.location.value,
      "position-type": e.target.positionType.value,
      "source": e.target.source.value
     }
);
job.then(function (response) {
  addJobsToDom();
}, function (error) {
  console.log(error);
});
form.reset();
}

async function addJobsToDom(){
  document.querySelector('ul').innerHTML = "";
  let response = await databases.listDocuments(
    "67b0078f0018d4b585c2",
    "67b008520018e7f21c67",
);
//console.log(response.documents[0]);
response.documents.forEach((job)=>{
  const li = document.createElement('li')
  li.textContent = `${job['company-name']} ${job['role']} ${job['location']} ${job['position-type']} ${job['source']} ${job['date-added']} coffee chat? ${job['chat']}`

  li.id = job.$id

  const deleteBtn = document.createElement('button')
  deleteBtn.innerText = 'Delete'
  deleteBtn.onclick = () => removeJob(job.$id)
  
  const coffeeBtn = document.createElement('button')
  coffeeBtn.innerText = 'coffee'
  coffeeBtn.onclick = () => updateChat(job.$id)
  
  li.appendChild(coffeeBtn)
  li.appendChild(deleteBtn)

  document.querySelector('ul').appendChild(li)
})

async function removeJob(id){
  const result = await databases.deleteDocument(
    '67b0078f0018d4b585c2', // databaseId
    '67b008520018e7f21c67', // collectionId
    id // documentId
);
  document.getElementById(id).remove()
}
async function updateChat(id){
  const result = databases.updateDocument(
    '67b0078f0018d4b585c2', // databaseId
    '67b008520018e7f21c67', // collectionId
    id, // documentId
    {'chat': true} // data (optional)
);
  result.then(function(){location.reload()})
}

// response.then(function (response) {
//     console.log(response);
// }, function (error) {
//     console.log(error);
// });
}
addJobsToDom();
// const promise = databases.createDocument(
//     '67b0078f0018d4b585c2',
//     '67b008520018e7f21c67',
//     ID.unique(),
//     { "company-name": "100Devs",
//       "date-added": new Date(),
//       "role": "software-engineer",
//       "location": "Boston",
//       "position-type": "full-time",
//       "source": "https://100devs.org",
//      }
// );

// promise.then(function (response) {
//     console.log(response);
// }, function (error) {
//     console.log(error);
// });
