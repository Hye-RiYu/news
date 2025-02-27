let newsList = [];
const menus = document.querySelectorAll(".menus-button button")
menus.forEach(menu => menu.addEventListener("click",(event) => getNewsByCategory(event)));

const truncateSummary = (summary) => {
  if (!summary) {
    return "내용없음";
  }
  if (summary.length > 200) {
    return summary.substring(0, 200) + "...";
  } else {
    return summary;
  }
};

const getLatestNews = async () => {
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
   );
  const response = await fetch(url);
  const data = await response.json()
  newsList = data.articles;
  render();
  console.log('data', data);
  console.log('newsList', newsList);
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category",category);
  const url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log("ddd",data);
  newsList = data.articles;
  render();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  console.log("keyword", keyword)
  const url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data", data)
  newsList = data.articles;
  render();
};

const render = () => {
  const newsHTML = newsList.map(news => {
    const imageSrc = news.urlToImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
    const sourceName = (news.source && news.source.name) ? news.source.name : "no source";
    console.log("Source:", news.source.name || "no source");

    const timeAgo = moment(news.publishedAt).fromNow();

    return `<div class="row news">
          <div class="col-lg-4">
            <img
              class="news-img-size"
              src="${imageSrc}"
              alt="뉴스 이미지"
              onError="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';"
            />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${truncateSummary(news.description)}</p>
            <div>${sourceName} 8 ${timeAgo}</div>
          </div>
        </div>`;
  }).join('');

        console.log("html", newsHTML);
        document.getElementById('news-board').innerHTML=newsHTML;
}


getLatestNews();



const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

// 1. 버튼들에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기