let currentWallet=0;
let HistoryArray=[];
const IconColors=["rgba(240, 126, 185, 0.6)", "rgba(255,179,71,0.65)","rgba(184, 248, 139, 0.6)","rgba(126, 228, 228, 0.65)","rgba(175, 145, 237, 0.6)"];
const IconSymbols=["fa-wallet","fa-user","fa-house","fa-heart","fa-store"];
let currentOption=0, currentOptionSymbol=0, defaultOption=0, defaultOptionSymbol=0;

const walletInputs = [{
    id: "walletName",
    name: "walletName",
    type: "text",
    label: "Wallet",
    placeholder: "Enter a wallet name"
}, {
    id: "walletAmount",
    name: "walletAmount",
    type: "number",
    label: "Amount",
    placeholder: "Enter wallet amount"
},
{
    id: "walletPassword",
    name: "walletPassword",
    type: "password",
    label: "Password - Optional",
    placeholder: "Enter a password"
}
]


const categoryInputs = [{
    id: "categoryName",
    name: "categoryName",
    type: "text",
    label: "Category",
    placeholder: "Enter a category name"
}]

const historyInputs = [{
    id: "historyName",
    name: "historyName",
    type: "text",
    label: "Item",
    placeholder: "Enter an item name"
}, {
    id: "historyAmount",
    name: "historyAmount",
    type: "number",
    label: "Amount",
    placeholder: "Enter the amount"
}]

const fundsInputs = [{
    id: "historyName",
    name: "historyName",
    type: "text",
    label: "Money Source",
    placeholder: "Enter the name of the source"
}, {
    id: "historyAmount",
    name: "historyAmount",
    type: "number",
    label: "Amount",
    placeholder: "Enter the amount"
}]

const updateWalletStorage = (wallet) => {
  const currentWallets = localStorage.getItem('wallets');
  let walletsArray=[];
  if(currentWallets) walletsArray = JSON.parse(currentWallets);
  walletsArray.push(wallet);
  localStorage.setItem("wallets", JSON.stringify(walletsArray))

}

const updateHistoryStorage = (history) => {
    const currentCategories = localStorage.getItem('history');
    let categoriesArray = [];
    if(currentCategories) categoriesArray=JSON.parse(currentCategories);   
    categoriesArray.push(history);    
    localStorage.setItem("history", JSON.stringify(categoriesArray))
}

const updateCategoryStorage = (category) => {
    const currentCategories = localStorage.getItem('categories');
    let categoriesArray = [];
    if(currentCategories) categoriesArray=JSON.parse(currentCategories);   
    categoriesArray.push(category);    
    localStorage.setItem("categories", JSON.stringify(categoriesArray))
}

const closeModal = (id) => {
  const modal = document.querySelector(`#${id}`);
  modal.remove();
}