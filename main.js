(function () {
  let saveBtn = document.querySelector("#saveAlbum");
  let addAlbumBtn = document.querySelector("#addAlbum");
  let deleteAlbumBtn = document.querySelector("#deleteAlbum");
  let renameAlbumBtn = document.querySelector("#renameAlbum");
  let importBtn = document.querySelector("#importAlbum");
  let exportBtn = document.querySelector("#exportAlbum");
  let playBtn = document.querySelector("#playAlbum");
  let selectBtn = document.querySelector("#selectAlbum");
  let overlay = document.querySelector("#overlay");
  let playOverlay = document.querySelector("#play-overlay");
  let addSlideBtn = document.querySelector("#newSlide");
  let allTemplates = document.querySelector("#allTemplates");
  let createSlide = document.querySelector("#create-slide");
  let saveSlideBtn = document.querySelector("#save-slide");
  let slideImg = document.querySelector("#slideImg");
  let slideTitle = document.querySelector("#slideTitle");
  let slideDetails = document.querySelector("#slideDetails");
  let slideList = document.querySelector("#slide-list");
  let showSlide = document.querySelector("#slide-show");
  let slideShowTitle = document.querySelector("#slide-title h2");
  let slideShowDetails = document.querySelector("#slide-details p");
  let slideShowImg = document.querySelector("#slide-img img");
  let editSlideBtn = document.querySelector("#edit-slide");
  let deleteSlideBtn = document.querySelector("#delete-slide");
  let uploadFileBtn = document.querySelector("#uploadFile");

  let albums = [];

  addAlbumBtn.addEventListener("click", addAlbum);
  selectBtn.addEventListener("change", selectAlbum);
  addSlideBtn.addEventListener("click", addSlide);
  saveSlideBtn.addEventListener("click", saveSlide);
  saveBtn.addEventListener("click", saveAlbum);
  deleteAlbumBtn.addEventListener("click", deleteAlbum);
  renameAlbumBtn.addEventListener("click", renameAlbum);
  exportBtn.addEventListener("click", exportAlbum);
  importBtn.addEventListener("click", function(){
    if(selectBtn.value == "-1"){
      alert("Please select or add an album to upload file!!");
      return;
    }

    uploadFileBtn.click();
  })
  uploadFileBtn.addEventListener("change", uploadFile);
  playBtn.addEventListener("click", playAlbum);
  //(1)
  function addAlbum() {
      let albumName = prompt("Enter a name for the new album!");
      if(albumName == null){
        return;
      }
      albumName = albumName.trim();

      if(!albumName){
        alert("Empty name not allowed!!");
      }else{
        let exsits = albums.some(a => a.name == albumName);

        if(exsits){
          alert("Other album exsits with this name, please try another name!");
          return;
        }
        albums.push({
          name : albumName,
          slides : [] 
        })

        let options = document.createElement("Option");
        options.setAttribute("value", albumName);
        options.innerHTML = albumName;

        selectBtn.appendChild(options);
        saveAlbum();

        selectBtn.value = albumName;
        selectBtn.dispatchEvent(new Event("change"));
      }
  }
//(8)
  function deleteAlbum(){
    let value = selectBtn.value;
    if(value == "-1"){
      alert("Please select an album to delete!!");
      return;
    }

    let ans = confirm('Are you sure you want to delete this album??');
    if(ans){
      let albumIndx = albums.findIndex(a => a.name == value);
      albums.splice(albumIndx, 1);
  
      selectBtn.remove(selectBtn.selectedIndex);
      selectBtn.dispatchEvent(new Event("change"));

      saveAlbum();
    }
  }
//(12)
  function renameAlbum(){
    if(selectBtn.value == "-1"){
      alert("Please select an album to rename!!");
      return;
    }

    let newName = prompt("Enter the new name you want to give to this album!!");
    if(newName == null){
      return;
    }
    newName = newName.trim();

    if(!newName){
      alert("Empty name not allowed!!");
    }else{
      let exsits = albums.some(a => a.name == newName);

      if(exsits){
        alert("Other album exsits with this name, please try another name!");
        return;
      }
      
      let value = selectBtn.value;
      let selectedAlbum = selectBtn.querySelectorAll("option");
      for(let i = 0; i < selectedAlbum.length; i++){
        if(selectedAlbum[i].innerHTML == value){
          selectedAlbum[i].innerHTML = newName;
          selectedAlbum[i].value = newName;
          break;
        }
      }
      
      let album = albums.find(a => a.name == value);
      album.name = newName;

      saveAlbum();
    }  
  }
//(13)
  function exportAlbum(){
    let albumName = selectBtn.value;
    if(albumName == "-1"){
      alert("Please select an album to download!!");
      return;
    }

    let album = albums.find(a => a.name == albumName);
    let albumJson = JSON.stringify(album);

    let encodedJson = encodeURIComponent(albumJson);
    let a = document.createElement("a");
    a.setAttribute("download", albumName + ".json");
    a.setAttribute("href", "data:text/json; charset=utf-8, " + encodedJson);

    a.click();
  }
//(14)  
  function uploadFile(){
    let file = window.event.target.files[0];
    let reader = new FileReader();

    reader.addEventListener("load", function(){
      let data = window.event.target.result;
      let importedAlbum = JSON.parse(data);

      let album = albums.find(a => a.name == selectBtn.value);
      album.slides = album.slides.concat(importedAlbum.slides);
      
      selectBtn.dispatchEvent(new Event("change"));
    })

    reader.readAsText(file);
  }
//(15)     
  function playAlbum(){
    if(selectBtn.value == "-1"){
      alert("Please select an album to play!!");
      return;
    }

    playBtn.innerHTML = "pause";
    playOverlay.style.display = "block";
    let slides = slideList.children;
    let counter = slides.length;
    let i = 0;

    let id = setInterval(function(){
      if(i < counter){
        slides[i].click();
        i++;
      }else{
        clearInterval(id);
        playBtn.innerHTML = "play_arrow";
        playOverlay.style.display = "none";
      }
    }, 1000);
  }
//(2)
  function selectAlbum(){
    let value = this.value;

    if(value == -1){
      slideList.innerHTML = "";
      overlay.style.display = "block";
      createSlide.style.display = "none";
      showSlide.style.display = "none";
    }else{
      let album = albums.find((a) => a.name == value);
      slideList.innerHTML = "";
      overlay.style.display = "none";
      createSlide.style.display = "block";
      showSlide.style.display = "none";

      album.slides.forEach((s, indx) => {
        let allTemplate = allTemplates.content.querySelector(".slide");
        let slide = document.importNode(allTemplate, true);
        slide.addEventListener("click", clickSilde);
        slide.querySelector(".slide-header h5").innerHTML = s.title;
        slide.querySelector(".content-details p").innerHTML = s.details;
        slide.querySelector(".content-img img").setAttribute("src", s.url);

        slideList.appendChild(slide);
        s.selected = false;
        if (indx == 0) {
          slide.dispatchEvent(new Event("click"));
          s.selected = true;
        }
      });
    }
  }
//(3)
  function addSlide(){
    createSlide.style.display = "block";
    showSlide.style.display = "none";

    createSlide.setAttribute("purpose", "create");
  }
//if(4) and else(11)
  function saveSlide(){
    let url = slideImg.value.trim();
    let title = slideTitle.value.trim();
    let desc = slideDetails.value.trim();

    if(!url || !title || !desc){
      slideImg.value = "";
      slideTitle.value = "";
      slideDetails.value = "";
      alert("Please fill all the fields to make a slide!!");
      return;
    }
    let albumName = selectBtn.value;
    let album = albums.find(s => s.name == albumName);

    if(createSlide.getAttribute("purpose") == "create"){
      album.slides.push({
        url : url,
        title : title,
        details : desc
      })
  
      let allTemplate = allTemplates.content.querySelector(".slide");
      let slide = document.importNode(allTemplate, true);
      slide.addEventListener("click", clickSilde);
      slide.querySelector(".slide-header h5").innerHTML = title;
      slide.querySelector(".content-details p").innerHTML = desc;
      slide.querySelector(".content-img img").setAttribute("src", url);
  
      slideList.appendChild(slide);
      slide.dispatchEvent(new Event("click"));
    }else{
      let slide = album.slides.find(s => s.selected == true);

      let slideToUpdate;
      for(let i = 0; i < slideList.children.length; i++){
        let slideDiv = slideList.children[i];
        if(slideDiv.querySelector(".slide-header h5").innerHTML == slide.title){
          slideToUpdate = slideDiv;
          break;
        }
      }
      slideToUpdate.querySelector(".slide-header h5").innerHTML = title;
      slideToUpdate.querySelector(".content-details p").innerHTML = desc;
      slideToUpdate.querySelector(".content-img img").setAttribute("src", url);
      
      slide.url = url;
      slide.title = title;
      slide.details = desc;
      slideToUpdate.dispatchEvent(new Event("click"));
    }
    slideImg.value = "";
    slideTitle.value = "";
    slideDetails.value = "";
  }
//(5)
  function clickSilde(){
    overlay.style.display = "none";
    createSlide.style.display = "none";
    showSlide.style.display = "block";

    let title = this.querySelector(".slide-header h5").innerHTML;
    let desc = this.querySelector(".content-details p").innerHTML;
    let url = this.querySelector(".content-img img").getAttribute("src");

    slideShowTitle.innerHTML = title;
    slideShowDetails.innerHTML = desc;
    slideShowImg.setAttribute("src", url);
    deleteSlideBtn.addEventListener("click", deleteSlide);
    editSlideBtn.addEventListener("click", editSlide);

    let album = albums.find(a => a.name == selectBtn.value);
    album.slides.forEach(s => {
      if(s.title == title){
        s.selected = true;
      }else{
        s.selected = false;
      }
    })
  }
  //(9)
  function deleteSlide(){
    let value = selectBtn.value;
    let album = albums.find(a => a.name == value);
    let slideIndx = album.slides.findIndex(s => s.selected == true);

    let allslides = slideList.children;
    let slideToDelete, nextSlide = 0;
    for(let i = 0; i < allslides.length; i++){
      if(allslides[i].querySelector(".slide-header h5").innerHTML == album.slides[slideIndx].title){
        slideToDelete = allslides[i];
        if(i < allslides.length-1){
          nextSlide = allslides[i+1];
        }
        break;
      }
    }

    slideList.removeChild(slideToDelete);
    if(nextSlide == 0){
      addSlideBtn.dispatchEvent(new Event("click"));
    }else{
      nextSlide.dispatchEvent(new Event("click"));
    }

    album.slides.splice(slideIndx, 1);
  }
//(10)
  function editSlide(){
    addSlide();

    slideImg.value = slideShowImg.getAttribute("src");
    slideTitle.value = slideShowTitle.innerHTML;
    slideDetails.value = slideShowDetails.innerHTML;

    createSlide.setAttribute("purpose", "update");
  }
//(6)
  function saveAlbum(){
    let albumsJson = JSON.stringify(albums);
    localStorage.setItem("data", albumsJson);
  }
//(7)
  function loadData(){
    let albumsJson = localStorage.getItem("data");
    if(!albumsJson){
      return;
    }

    albums = JSON.parse(albumsJson);
    albums.forEach(s => {
      let options = document.createElement("Option");
      options.setAttribute("value", s.name);
      options.innerHTML = s.name;

      selectBtn.appendChild(options);
    })
  }

  loadData();
})();
