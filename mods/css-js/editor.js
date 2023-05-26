//Infos
let docu = [];
let indc;
let numb;

//Snapshot
const loadMods = bankOf.collection("Modpack Atual");
const coleccao = bankOf.collection('Modpack Atual');

loadMods.orderBy("indice", "asc").onSnapshot((snapThis)=>{
  docu = [];
  indc = snapThis.size;
  if(indc == 0){
    numb = 0;
  }else{
    numb = snapThis.docs[snapThis.size - 1].data().indice;
  }
  snapThis.forEach((snap, index)=>{
    const box = snap.data();
    docu.push(box);
    playArray();
    if(snap === "added"){
      loadInfos(box, index);
      playArray();
    }
    if(snap === "modified"){
      loadInfos(box, index);
      playArray();
    }
    if(snap === "removed"){
      playArray();
    }
  })
});

function playArray(){
  Laucher.innerHTML = '';
  Mods.innerHTML    = '';
  Misc.innerHTML    = '';
  let docuReverso = docu.slice();
  docu.forEach((snapo, index)=>{
    let card     = document.createElement('DIV');
    let title    = document.createElement('input');
    let desc     = document.createElement('textarea');
    let obs      = document.createElement('input');
    let time     = document.createElement('input');
    let download = document.createElement('input');
    let iconURL  = document.createElement('input');
    let icone    = document.createElement('img');
    let remove   = document.createElement('button');
    let save     = document.createElement('button');
    let removed  = document.createElement('button');
    let local    = document.createElement('select');
    let locales  = ["Mods", "Laucher", "Tributo", "Extra"];
    
    title.value      = snapo.nome;
    desc.value       = snapo.descricao;
    obs.value        = snapo.observacao;
    icone.src        = snapo.icon;
    removed.value    = snapo.removido;
    time.value       = snapo.tempo;
	
	title.placeholder= 'Titulo';
	desc.placeholder = 'Descrição';
	obs.placeholder	 = 'Observação';
    
    //Array Inside
    for(var x = 0; x < locales.length; x++){
      let options = document.createElement('option');
      options.innerHTML = locales[x];
      local.append(options);
    }
    
    local.value      = snapo.area;
    
    //Condições
    iconURL.placeholder = 'Icone';
    download.placeholder= 'Link De Download Do Mod';
    time.placeholder    = 'Mod Preview';
    
    if(icone.src.search(/.jpg|.jpeg|.png|.gif|.com/) !== -1){
      iconURL.value = snapo.icon;
      icone.classList.remove('noImg');
    }else{
      iconURL.value = '';
      icone.src = '';
      icone.classList.add('noImg');
    }
    if(snapo.download.search(/.com|.org|.net|.br|.io/) !== -1){
      download.value = snapo.download;
    }else{
      download.value = '';
    }
    card.append(icone, title, desc, obs, time, download, iconURL, removed, save, remove, local);
    
    //Place
    
    if(snapo.area === 'Mods'){
      Mods.append(card);
    }
    else if(snapo.area === 'Laucher'){
      Laucher.append(card);
    }else{
      Misc.append(card);
    }
    
    //Variante
    function remButton(){
      if(removed.value == 0){
        removed.classList.remove('rem');
        card.classList.add('noMod');
      }else{
        removed.classList.add('rem');
        card.classList.remove('noMod');
      }
    }
    remButton();
    
    //Funções
    function updateAll(){
      loadMods.doc(snapo.doc).update({
        nome:       title.value,
        descricao:  desc.value,
        download:   download.value,
        observacao: obs.value,
        area:       local.value,
        icon:       iconURL.value,
        removido:   removed.value,
        tempo:      time.value,
      });
    }
    
    remove.addEventListener('click', ()=>{
      loadMods.doc(snapo.doc).delete().then(()=>{});
    });
    
    save.addEventListener('click', ()=>{
      updateAll();
    });
    
    removed.addEventListener('click', ()=>{
      if(removed.value == 0){
        removed.value = 1;
      }else{
        removed.value = 0;
      }
      updateAll();
      remButton();
    })
    
    iconURL.addEventListener('input', ()=>{
      icone.src = iconURL.value;
    });
    local.addEventListener('change', ()=>{
      // loadMods.doc(snapo.doc).update({
      //   area: local.value
      // })
      updateAll();
    });
    
    icone.addEventListener('click', ()=>{
      iconURL.focus();
      iconURL.select();
    });
    time.addEventListener('input', ()=>{
      time.value = time.value.replace('https://youtu.be/', 'https://www.youtube.com/embed/');
      time.value = time.value.replace('?t=', '?start=');
    });
  });
}

//ADD BOX
addMod.addEventListener('click', ()=>{
  console.log(parseInt(indc) + 1);
  const novoDoc = `Mod ${parseInt(numb) + 1}`;
  loadMods.doc(novoDoc).set({
    nome:       'Titulo',
    descricao:  '',
    doc:        novoDoc,
    download:   '',
    observacao: '',
    area:       'Mods',
    icon:       '',
    removido:   1,
    indice:     parseInt(numb) + 1,
    tempo:      '',
  });
  setTimeout(()=>{
    let xDD = document.querySelector('#Mods div:last-of-type input:first-of-type');
    xDD.focus();
  }, 50);
});


//Update Page

const dataUpdate = bankOf.collection('update');
const updateName = document.querySelector('#updateVersion input');
const updateDate = document.querySelector('#updateVersion p');

updateName.addEventListener('input', ()=>{
  updateName.value = updateName.value.toUpperCase();
});

dataUpdate.doc('update').onSnapshot((slap)=>{
  let updateInfos = slap.data();
  if(localStorage.getItem('updateIs') == undefined ||localStorage.getItem('updateIs') == null){
	  localStorage.setItem('updateIs', 'none');
  }
  localStorage.setItem('updateIs', updateInfos.code);
  updateName.value     = updateInfos.code;
  updateDate.innerHTML = updateInfos.date;
  
  updateName.addEventListener('change', ()=>{
    let data = new Date();
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth()).padStart(2, '0');
    let ano = data.getFullYear();
    let hora= String(data.getHours()).padStart(2, '0');
    let min = String(data.getMinutes()).padStart(2, '0');
    let dateFormat = `${dia}/${mes}/${ano} as ${hora}:${min}`;
    console.log(dia);
    dataUpdate.doc('update').update({
      code: updateName.value,
      date: dateFormat,
    });
  });
});