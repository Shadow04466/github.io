import { db } from "./firebase.js";
import { collection, getDocs, getDoc, doc, updateDoc, increment, addDoc }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const postsBox=document.getElementById("posts");
const postBox=document.getElementById("post");
let allPosts=[];

function injectAds(html){
 return html.replace("</p>",`</p>
 <div class="ad-container"><div class="ad-box">Ad</div></div>`);
}

async function load(){
 const snap=await getDocs(collection(db,"posts"));
 allPosts=[];
 snap.forEach(d=>{
  const p=d.data();
  if(p.status==="publish") allPosts.push({id:d.id,...p});
 });
 render();
}

function render(){
 postsBox.innerHTML="";
 allPosts.forEach(p=>{
  postsBox.innerHTML+=`
  <div class="col-md-4">
   <div class="card blog-card">
    ${p.image?`<img src="${p.image}">`:""}
    <div class="card-body">
     <h5>${p.title}</h5>
     <p>${p.content.replace(/<[^>]+>/g,"").slice(0,120)}...</p>
     <a href="post.html?id=${p.id}">Read</a>
    </div>
   </div>
  </div>`;
 });
 loadTrending();
}

async function loadTrending(){
 trending.innerHTML="";
 allPosts.sort((a,b)=>(b.likes||0)-(a.likes||0))
 .slice(0,5)
 .forEach(p=>{
  trending.innerHTML+=`<li class="list-group-item">
  <a href="post.html?id=${p.id}">${p.title}</a></li>`;
 });
}

window.subscribe=async()=>{
 if(!subEmail.value.includes("@")) return;
 await addDoc(collection(db,"subscribers"),{email:subEmail.value});
 alert("Subscribed");
 subEmail.value="";
};

if(postsBox) load();

if(postBox){
 const id=new URLSearchParams(location.search).get("id");
 const snap=await getDoc(doc(db,"posts",id));
 const p=snap.data();
 postBox.innerHTML=`<h1>${p.title}</h1>${injectAds(p.content)}`;
 likeBtn.onclick=()=>updateDoc(doc(db,"posts",id),{likes:increment(1)});
}
