let newsList = [];
const menus = document.querySelectorAll(".menus-button button")
menus.forEach(menu => menu.addEventListener("click",(event) => getNewsByCategory(event)));

let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
 );

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;


const getNews = async () => {
  try {
    url.searchParams.set("page", page); // => &page = page
    url.searchParams.set("pageSize",pageSize);

    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd", data)
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults
      render();
      paginationRender();
    }else {
      throw new Error(data.message);
    }

  } catch (error) {
    errorRender(error.message);
  }

}

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
  url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`);
  await getNews();

};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`);
  await getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`);
  await getNews();
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

const errorRender = (errorMessage) => {
  const errorHTML = 
    `<div class="alert alert-danger" role="alert">
      ${errorMessage}
    </div>`;

    document.getElementById("news-board").innerHTML = errorHTML;
}

const paginationRender = () => {
  // totalResult
  // page
  // pageSize
  // groupSize
  // totalPages
  const totalPages = Math.ceil(totalResults/pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page/groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  if(lastPage > totalPages) {
    lastPage = totalPages
  }
  // firstPage
  const firstPage = lastPage - (groupSize - 1) <=0? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ''

  if(page > 1) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#">&lt&lt</a></li>
                        <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt</a></li>`
  }

  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? "active" : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }

  if (page < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#">&gt</a></li>
                    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt&gt</a></li>`
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
  
  // <nav aria-label="Page navigation example">
  // <ul class="pagination">
  //   <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //   <li class="page-item"><a class="page-link" href="#">1</a></li>
  //   <li class="page-item"><a class="page-link" href="#">2</a></li>
  //   <li class="page-item"><a class="page-link" href="#">3</a></li>
  //   <li class="page-item"><a class="page-link" href="#">Next</a></li>
  // </ul>
  // </nav>
}

const moveToPage = (pageNum) => {
  console.log("moveToPage",pageNum);
  page = pageNum;
  getNews();
};

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