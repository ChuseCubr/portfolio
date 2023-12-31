// ELEMENT INITIALIZATION
// Setting these properties in HTML would be repetitive, so do that here
const searchBar = document.getElementById("search-bar");

function goHome() {
	window.location.href = "#";
	searchBar.select();
}

const pages = document.getElementsByClassName("page");
document.getElementById("down").onclick = function() {
	window.location.href = `#${pages[1].id}`;
}

const homeButtons = document.getElementsByClassName("home");
for (let button of homeButtons) {
	button.onclick = goHome;
}

const prevButtons = document.getElementsByClassName("prev");
for (let button of prevButtons) {
	prevSection = button.closest("section").previousElementSibling.id;
	button.href = `#${prevSection}`
}

const nextButtons = document.getElementsByClassName("next");
for (let button of nextButtons) {
	nextSection = button.closest("section").nextElementSibling.id;
	button.href = `#${nextSection}`
}

const items = document.getElementsByClassName("info-item");
for (let item of items) {
	item.dataset.highlighted = "1";
}

const sections = document.getElementsByClassName("info-section");
for (const section of sections) {
	const href = section.dataset.sectionHref;
	const links = section.querySelectorAll("a");
	for (let link of links) {
		link.href = href;
	}
}

// KEYMAPS
// Keyboard-based navigation for accessibility (vim users be like)
document.onkeydown = function(ev) {
	if (ev.target.tagName.toLowerCase() === "input") {
		return;
	}

	const activePageIndex = Math.floor(window.scrollY / document.documentElement.clientHeight);
	const activePage = pages[activePageIndex];
	switch (ev.key) {
		case "/":
			ev.preventDefault();
			goHome();
			break;
		case "j":
		case "l":
		case "ArrowDown":
		case "ArrowRight":
			if (activePageIndex === pages.length - 1) {
				return;
			}

			const nextPage = activePage.nextElementSibling.id;
			window.location.href = `#${nextPage}`
			return false;
		case "k":
		case "h":
		case "ArrowUp":
		case "ArrowLeft":
			const prevPage = activePage.previousElementSibling.id;
			window.location.href = `#${prevPage}`
			return false;
	}
}

// SEARCH BAR LOGIC
function contains(str, pattern) {
	let pattern_idx = 0;
	for (i = 0; i < str.length; i++) {
		if (pattern_idx === pattern.length) {
			return true;
		}
		if (str[i] === pattern[pattern_idx]) {
			pattern_idx += 1;
		}
	}

	if (pattern_idx === pattern.length) {
		return true;
	}

	return false;
}

searchBar.onkeyup = function(ev) {
	const query = searchBar.value.trim();

	if (ev.key === "Escape") {
		searchBar.blur();
		return;
	}

	if (query === "") {
		for (let item of items) {
			if (item.dataset.highlighted !== "1") {
				item.dataset.highlighted = "1";
			}
		}
		return;
	}

	if (ev.key === "Enter") {
		for (const item of items) {
			const item_label = item.innerText.toLowerCase();
			if (contains(item_label, query.toLowerCase())) {
				const parentSection = item.closest(".info-section");
				const href = parentSection.dataset.sectionHref;
				window.location.href = href;
				document.querySelector(href).focus();
				return;
			}
		}
		return;
	}

	for (let item of items) {
		if (contains(item.innerText.toLowerCase(), query.toLowerCase())) {
			if (item.dataset.highlighted !== "1") {
				item.dataset.highlighted = "1";
			}
		} else {
			if (item.dataset.highlighted !== "0") {
				item.dataset.highlighted = "0";
			}
		}
	}
};

// INFO TOGGLE
const noticeIcon = document.getElementById("notice-icon");
const noticeText = document.getElementById("notice-text");
noticeIcon.onmouseover = function() {
	noticeText.dataset.display = "1";
}

noticeIcon.onmouseout = function() {
	noticeText.dataset.display = "0";
}

// COLORSCHEME TOGGLE
const colors = {
	"dark": {
		"--clr-base": "#191724",
		"--clr-surface": "#1f1d2e",
		"--clr-overlay": "#26233a",
		"--clr-muted": "#6e6a86",
		"--clr-subtle": "#908caa",
		"--clr-text": "#e0def4",
		"--clr-love": "#eb6f92",
		"--clr-gold": "#f6c177",
		"--clr-rose": "#ebbcba",
		"--clr-pine": "#31748f",
		"--clr-foam": "#9ccfd8",
		"--clr-iris": "#c4a7e7",
		"--clr-highlight-low": "#21202e",
		"--clr-highlight-med": "#403d52",
		"--clr-highlight-high": "#524f67",
		"--clr-shadow": "var(--clr-base)",
	},
	"light": {
		"--clr-base": "#faf4ed",
		"--clr-surface": "#fffaf3",
		"--clr-overlay": "#f2e9e1",
		"--clr-muted": "#9893a5",
		"--clr-subtle": "#797593",
		"--clr-text": "#575279",
		"--clr-love": "#b4637a",
		"--clr-gold": "#ea9d34",
		"--clr-rose": "#d7827e",
		"--clr-pine": "#286983",
		"--clr-foam": "#56949f",
		"--clr-iris": "#907aa9",
		"--clr-highlight-low": "#f4ede8",
		"--clr-highlight-med": "#dfdad9",
		"--clr-highlight-high": "#cecacd",
		"--clr-shadow": "var(--clr-highlight-med)",
	}
}

let darkMode = true;
let root = document.querySelector(":root");
const darkModeButton = document.getElementById("toggle-dark-mode");

function toggleDarkMode() {
	if (darkMode === false) {
		darkMode = true;
		for (const [name, color] of Object.entries(colors.dark)) {
			root.style.setProperty(name, color);
			darkModeButton.innerText = "light_mode";
		}
	} else {
		darkMode = false;
		for (const [name, color] of Object.entries(colors.light)) {
			root.style.setProperty(name, color);
			darkModeButton.innerText = "dark_mode";
		}
	}
}

darkModeButton.onclick = toggleDarkMode;
