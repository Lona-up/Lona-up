const apiUrl = "https://script.google.com/macros/s/AKfycbxV1vaybUjOGc7TkduV_xZXKp1SRsszNkx9sKbZ_-ec-1OCM0BKr71d9dlIZx6AKVJqfQ/exec";

async function loadAllData() {
  const loadingElement = document.getElementById("loading"); // ローディング要素を取得
  loadingElement.style.display = "block";// ローディング表示を開始
  const timestamp = new Date().getTime(); // 現在時刻のタイムスタンプを取得
  const url = `${apiUrl}?query=&positions=&_=${timestamp}`; // タイムスタンプをURLに追加
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data); // 全データを表示
  } catch (error) {
    console.error("データのロード中にエラーが発生しました:", error);
    document.getElementById("results").innerHTML = `<p style="color: red;">エラーが発生しました。</p>`;
  }　finally {
    // ローディング表示を終了
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }
}

// ページ読み込み時に全データを表示

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const positionCheckboxes = document.querySelectorAll(".position-filter");

  // 検索ボックスに入力イベントを追加
  searchInput.addEventListener("input", performSearch);

  // チェックボックスの変更イベントにも検索を紐付け
  positionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", performSearch);
  });

  // 初期表示で全データを表示
  loadAllData();
});


async function performSearch() {
  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block"; // ローディング開始

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
  } finally {
    loadingElement.style.display = "none"; // ローディング終了
  }
}

function displayResults(data) {
  const resultsContainer = document.getElementById("results");
  const resultCountElement = document.getElementById("result-count");
  resultsContainer.innerHTML = "";

  if (!resultCountElement) {
    console.error("result-count 要素が見つかりません。HTML を確認してください。");
    return;
  }

  if (data.length === 0) {
    resultsContainer.innerHTML = "<p></p>";
    resultCountElement.textContent = "該当件数: 0件";
    return;
  }

  resultCountElement.textContent = `該当件数: ${data.length}件`;

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
