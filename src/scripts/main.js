
import './sass/styles.sass'
export const genNews = (()=>{
  let show = 5;
  let node;
  let searchForm = document.getElementById('form');
  let query = document.getElementById('query')
  query.onkeypress = (e)=>{
    if (e.key === "Enter"){
      let event = new Event('submit', {
        'view': window,
        'bubbles': true,
        'cancelable': true});
      searchForm.dispatchEvent(event);
    }
  }
  searchForm.onsubmit = (e)=>{
    e.preventDefault();
    let searchQuery=  query.value.trim();
    if (searchQuery !== '' ){
      show=5;
      getReq(`q=${searchQuery}&`)
    }
    return false
  }
  let readMore = document.getElementById('loadMore');
  const appendSnippets = ()=>{
    let root =document.getElementById('root');
    let frag = document.createDocumentFragment();
    for (let i = 0; i < show; ++i) {
      frag.appendChild(node[i]);
    }
    root.appendChild(frag);
  };
  readMore.onclick=()=>{

    if (show<40){
      show+=5
    }
    if(show> node.length){
      show =node.length
    }
    appendSnippets();
  }

  const generateNews = (newsArray)=>{
    let root =document.getElementById('root');
    root.innerHTML = '';
    if (newsArray.length === 0 ){
      let txt =document.createElement('h1');
      txt.innerText = 'nothing found';
      root.appendChild(txt);
      return
    }
    node = newsArray.map((el)=>{
      let newsSnippet = document.createElement('div');
      let img = document.createElement('img');
      let link = document.createElement('a');
      let text = document.createElement('p');
      text.innerText = el.content;
      link.href = el.url;
      link.target = "_blank";
      link.innerText= el.title;
      img.src = el.urlToImage;
      img.className = 'image';
      newsSnippet.className="snippet";
      let header =  document.createElement('h2');
      header.className = "title";
      header.appendChild(link);
      newsSnippet.appendChild(header);
      newsSnippet.appendChild(img);
      newsSnippet.appendChild(text);
      return (newsSnippet)
    });
    appendSnippets()
  };
  const getReq  = (q, src)=> {
    let quer = q  ?  q : 'q=it&';
    let sorc = src ? src : '';
    var url = 'https://newsapi.org/v2/' +
      'everything?' +
      quer +
      sorc +
      'apiKey=8a64d50f1b56426b902b32643949dfad';
    var req = new Request(url);
    fetch(req)
      .then((response) => {
        response.json()
          .then((res) => {
            generateNews(res.articles);
          })
      })
  }
  const appendOptions = (res)=>{
    let optArr =res.map((el)=>{
      let opt = document.createElement('option');
      opt.value=el.id;
      opt.innerText = el.name;
      return opt
    })
    let frag = document.createDocumentFragment();
    for (let i = 0; i < 20 ; i++) {
      frag.appendChild(optArr[i]);
    }
    let options = document.getElementById('options');
    options.appendChild(frag);
    options.onchange = (e)=>{
      getReq(null,`sources=${e.target.value}&`);
    }
  }

  const generateOptions = ()=> {
    var url = 'https://newsapi.org/v2/sources' +
      '?apiKey=8a64d50f1b56426b902b32643949dfad';
    var req = new Request(url);
    fetch(req)
      .then((response) => {
        response.json()
          .then((res) => {
            appendOptions(res.sources)
          })
      })
  }
  generateOptions();
  getReq();
})();
