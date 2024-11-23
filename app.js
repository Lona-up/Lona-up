const apiUrl = "https://script.google.com/macros/s/AKfycbxV1vaybUjOGc7TkduV_xZXKp1SRsszNkx9sKbZ_-ec-1OCM0BKr71d9dlIZx6AKVJqfQ/exec"; // GASで発行されたURL
const resultsContainer = document.querySelector("#results-container");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const checkboxes = document.querySelectorAll(".position-filter");
const matchesPosition = positions.length === 0 || positions.includes(row[2].trim().toLowerCase()); // 比較の前に正規化
const matchesQuery = query ? row.some(cell => cell.toString().includes(query)) : true; // query が空でない場合のみフィルタリング



async function search() {
  const query = document.getElementById("searchInput").value;
  const selectedPositions = Array.from(document.querySelectorAll(".position-filter:checked"))
    .map(checkbox => checkbox.value);
 const url = `${apiUrl}?query=${encodeURIComponent(query)}&positions=${encodeURIComponent(selectedPositions.join(","))}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.error("検索中にエラーが発生しました:", error);
    document.getElementById("results").innerHTML = `<p style="color: red;">エラーが発生しました。</p>`;
  }
}

function displayResults(data) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (data.length === 0) {
    resultsContainer.innerHTML = "<p>該当するデータがありません。</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `
      <p><strong>Name:</strong> ${item.Name || "2/29"}</p>
      <p><strong>背番号:</strong> ${item.Number || "2/29"}</p>
      <p><strong>ポジション:</strong> ${item.Position || "2/29"}</p>
      <img src="${item.image || 'https://via.placeholder.com/150'}" alt="Content Image" />

    `;
    resultsContainer.appendChild(div);
  });


  
}
