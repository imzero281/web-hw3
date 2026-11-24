//sortBy: 영화 배열 ⇒ 평점 높은 순으로 정렬한 새 배열 출력 (원본은 그대로 둠)
const sortBy = (list, key, desc) => {
    const sign = desc ? -1 : 1;
    return [...list].sort((a, b) => {
        if (typeof a[key] === "string") {
            return sign * a[key].localeCompare(b[key]);
        }
        else {
            return sign * (a[key] - b[key]);
        }
    });
}

//search : 배열, 문자열 ⇒ 검색어가 제목에 포함된 영화들의 새 배열(검색 결과 배열)
const search = (list, keyword) => {
    const word = keyword.trim().toLowerCase();
    return list.filter(m => m.title.toLowerCase().includes(word));
}

//포스터 경로, 크기 ⇒ TMDB 이미지 주소(문자열)
const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) { card.classList.add("hot"); }

        // (나)
        card.setAttribute("data-type", m.type);
        card.setAttribute("data-title", m.title);

        // (다)
        const rankHtml = m.type === "boxoffice"
            ? `<span class="rank">${m.rank}</span>`
            : "";

        // (라)
        if (m.poster === null) {
            card.classList.add("no-poster");
        }
        const posterHtml = m.poster === null
            ? `<div class="poster-fallback">${m.title[0]}</div>`
            : `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;

        card.innerHTML = `
      ${posterHtml}
      ${rankHtml}
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
        <button class="like" type="button">♥</button>
      </div>`;
        board.appendChild(card);
        card.dataset.id = m.id;
        card.onclick = function () { alert(m.overview); };
    }
    document.getElementById("count").textContent = list.length + "편";

    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}

function getView() {

    const keyword = document.querySelector("#q").value;
    const sortType = document.querySelector("#sort").value;
    const selectedType = document.querySelector('input[name="type"]:checked').value;

    let result = [...movies];

    if (keyword.trim() !== "") {
        result = search(result, keyword);
    }

    if (selectedType !== "all") {
        result = result.filter(m => m.type === selectedType);
    }
    result = sortBy(result, sortType, sortType !== "title");

    return result;
}

function refresh() {
    renderCards(getView());
}

refresh();

document.querySelector("#q").addEventListener("input", refresh);
document.querySelector("#sort").addEventListener("change", refresh);
document.querySelector("#typeFilter").addEventListener("change", refresh);