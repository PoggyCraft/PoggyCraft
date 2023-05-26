//Update Local
const dataUpdate = bankOf.collection('update');
const updateName = document.querySelector('#updateVersion input');
const updateDate = document.querySelector('#updateVersion p');
const updateZone = document.querySelector('#updateVersion');
const updateDesc = document.querySelector('#UpdateInformation p');

let updateIs   = localStorage.getItem('updateIs');
let lastUpdate = localStorage.getItem('lastUpdate');

updateName.addEventListener('input', ()=>{
  updateName.value = updateName.value.toUpperCase();
});

dataUpdate.doc('update').onSnapshot((slap)=>{
  let updateInfos = slap.data();
  updateName.value     = updateInfos.code;
  updateDate.innerHTML = updateInfos.date;
  localStorage.setItem('updateIs', updateInfos.code);
  
  updateZone.addEventListener('click', ()=>{
    let updateIs   = localStorage.getItem('updateIs');
    let lastUpdate = localStorage.getItem('lastUpdate');
    console.log(updateIs, lastUpdate);
    updateDesc.innerHTML = `Atualização Atual: ${updateIs} <br/>Sua Atualização: ${lastUpdate}`;
    UpdateInformation.style.top = '0vw';
  });
  if(updateIs == null || lastUpdate == null){
    localStorage.setItem('atual', updateInfos.code);
    localStorage.setItem('lastUpdate', '0');
  }
});

UpdateInformation.addEventListener('click', ()=>{
  UpdateInformation.style.top = '';
});

//Real Script

let datos = [];

let indice;
let lastest;
let howMany;

let downTown = bankOf.collection("Modpack Atual");

storageBase();


function storageBase(){
  let updateIs   = localStorage.getItem('updateIs');
  let lastUpdate = localStorage.getItem('lastUpdate');
  
  if(updateIs == lastUpdate){
    datos = JSON.parse(localStorage.getItem('ListMod'));
    if(datos == null){
      setTimeout(()=>{
        storageBase();
      },500);
    }else{
      arrayThis();
    }
    console.log('Não Teve que baixar Dados');
  }else{
    getInformations();
  }
}


function getInformations(){
    downTown.orderBy("indice", "asc").onSnapshot((snop)=>{
      datos = [];
      howMany = snop.size;
      
      snop.forEach((snup, index)=>{
        let panel = snup.data();
        datos.push(panel);
        localStorage.setItem("ListMod", JSON.stringify(datos));
        arrayThis();
        console.log('Teve que baixar Dados');
        if(snup === 'added'){
          arrayThis();
        }
        if(snup === 'modified'){
          arrayThis();
        }
        localStorage.setItem('lastUpdate', updateIs);
        setTimeout(()=>{
          localStorage.setItem('lastUpdate', localStorage.getItem('updateIs'));
        }, 500);
      });
    });
}

console.log(datos);
if(datos == ''){
  console.log(lastUpdate);
  getInformations();
}

//   ARRAY

function arrayThis(){
  Content.innerHTML ='';
  Titles.innerHTML = '';
  RemovedMods.innerHTML = '';
  FooterContent.innerHTML = '';
  datos.forEach((panel)=>{
    let box        = document.createElement('DIV');
    let icon       = document.createElement('IMG');
    let title      = document.createElement('H1');
    let descricao  = document.createElement('H2');
    let observacao = document.createElement('H3');
    let download   = document.createElement('BUTTON');
    
    //content
    title.innerHTML     = panel.nome;
    descricao.innerHTML = panel.descricao;
    observacao.innerHTML= panel.observacao;
    icon.src            = panel.icon;
    icon.setAttribute('draggable', 'false');
    
    //Conversores
    // title.title = `${Math.floor(panel.tempo / 60)}:${(panel.tempo % 60 < 10 ? "0": "") + panel.tempo % 60}`;
    
    //Retornos
    if(panel.icon.search(/.jpg|.jpeg|.png|.gif|.com/) !== -1){
      box.append(icon);
    }
    box.append(title, descricao, observacao);
    if(panel.download.search(/.com|.org|.br|.net|.io|.int/) == -1){
    }else{
      box.append(download);
    }
    
    //Categorias
    if(panel.area === 'Laucher'){
      Titles.append(box);
      if(panel.removido == '0'){
        box.classList.add('removedPanel');
      }else{
        box.classList.remove('removedPanel');
      }
    }
    if(panel.area === 'Mods' && panel.removido === '1'){
	  if(panel.tempo !== ''){
	  	title.title = `Preview do ${panel.nome}`;
	  }
      title.addEventListener('click', ()=>{
        const ytVid = document.querySelector('#videoYoutube iframe');
        const testo = document.getElementById('xDDD');
		if(panel.tempo !== ''){
			if(panel.tempo.includes('?t=') || panel.tempo.includes('?start=')){
				testo.src = `${panel.tempo}&autoplay=1`;
			}else{
				testo.src = `${panel.tempo}?autoplay=1`;
			}
		}
      });
      Content.append(box);
    }
    if(panel.area === 'Mods' && panel.removido === '0'){
	  if(panel.tempo !== ''){
	  	title.title = `Preview do ${panel.nome}`;
	  }
      title.addEventListener('click', ()=>{
        const ytVid = document.querySelector('#videoYoutube iframe');
        const testo = document.getElementById('xDDD');
		if(panel.tempo !== ''){
			testo.src = `${panel.tempo}&autoplay=1`;
		}
      });
      RemovedMods.append(box);
    }
    if(panel.area === 'Extra'){
      FooterContent.append(box);
    }
    
    const h4LeftPanel = document.querySelector('#LeftPanel h4:nth-of-type(2)');
    if(RemovedMods.innerHTML === ''){
      h4LeftPanel.style.display = 'none';
    }else{
      h4LeftPanel.style.display = '';
    }
    
    //Funções
    download.addEventListener('click', ()=>{
      window.open(panel.download, '_blank')
    })
  });
}