///Logo intro
const SwitchLogoToApp = setTimeout(()=>{
  const logo=document.getElementById('logo');
  const app=document.getElementById('app');
  app.style.visibility='visible';
  logo.style.visibility='hidden';
  Initialization();
}, 4000);

///Light/dark theme
const toggleSwitchMode=document.getElementById('toggle');
toggleSwitchMode.addEventListener('click',()=>{
    const main=document.querySelector('main');
    const aside=document.querySelector('aside');
    const historyArea=main.querySelector('div.history');
    const ul=historyArea.querySelector('ul')
    const totalArea=main.querySelector('.total');
    const body=document.querySelector('body');
    const appElements=[body,toggleSwitchMode,main,aside,ul,totalArea];
    for(let i=0; i<appElements.length; i++)
        appElements[i].classList.toggle('darkmode');
});

///Other
function ChangeVisibility(name)
{
  const container=document.querySelectorAll("."+name+"-item-container");
  const UlElement=container[container.length-1]; //last element
  const LiElement=UlElement.querySelectorAll("li");
  for(let i=0; i<LiElement.length; i++)
        LiElement[i].style.display = "none";
  const SelectedLiElement=UlElement.querySelectorAll("."+name+currentWallet)
  for(let i=0; i<SelectedLiElement.length; i++)
        { 
        SelectedLiElement[i].style.display = "block";
        SelectedLiElement[i].style.visibility = "visible";
      }
}

function AddOptionsToForm(selectWallet,name, number=-1) 
{
  const currentWallets = localStorage.getItem(name);
  const walletsArray = JSON.parse(currentWallets);
  
  walletsArray.forEach((item)=>{
    if(number==-1 || item.wallet==number){
    const option=document.createElement('option');
    option.value=item.name;
    option.textContent=item.name;
    
    selectWallet.appendChild(option);
    
  }
  });
}
  
function DeleteElement(currentElement) 
{
  const currentHistory = localStorage.getItem('history');
  if(currentHistory) HistoryArray=JSON.parse(currentHistory); 
  const element=currentElement.parentElement.parentElement.parentElement;
  const parent=currentElement.parentElement.parentElement.parentElement.parentElement;
  const child=parent.querySelectorAll("li");
  for(let i=0; i<child.length; i++) {
      if(child[i]==element)
      {
        
        if(HistoryArray[i].value==-1) //expense
            {
            updateAside(HistoryArray[i],'Wallets',HistoryArray[i].wallet,-1,-1);
            updateAside(HistoryArray[i],'Categories',HistoryArray[i].category,+1,-1);
            }
        else //income
           {
            updateAside(HistoryArray[i],'Wallets',HistoryArray[i].wallet,1,-1);
           }
        const before=HistoryArray.slice(0,i);
        const after=HistoryArray.slice(i+1,child.length);
        HistoryArray=before.concat(after);
        currentElement.parentElement.parentElement.parentElement.remove();
        break;
      }
    }
    localStorage.setItem("history", JSON.stringify(HistoryArray));
}
function updateAside(data,area,position,value,del=1)
{
  const current = localStorage.getItem(area.toLowerCase());
  const Array = JSON.parse(current);
  Array[position].balance=parseInt(data.balance)*value*del+parseInt(Array[position].balance);
  if(area=='Wallets')
  {
    if(value==-1 ) Array[position].expenses+=parseInt(data.balance)*del; 
    else Array[position].incomes+=parseInt(data.balance)*del;
    localStorage.setItem(area.toLowerCase(), JSON.stringify(Array));
    ModifyMain(1,Array[position].name,Array[position].incomes,Array[position].expenses,area);
  }
  else
  {
    localStorage.setItem(area.toLowerCase(), JSON.stringify(Array));
  }
  const widget=document.querySelector(`#widget${area}`);
  const widgetItem=widget.querySelectorAll('.widget-item-balance');
  widgetItem[position].textContent=Array[position].balance;
  
}

function ModifyMain(mode=0,name,incomes,expenses)
{
  const current = localStorage.getItem('wallets');
  let walletsArray=[];
  if(current) walletsArray = JSON.parse(current);
  for(let i=0; i<walletsArray.length; i++)
      if(walletsArray[i].name==name)
          {position=i; break;}
  if(mode==1 && position!=currentWallet) return;
  if(walletsArray[position].password!="")
      {OpenWalletWithPassword(walletsArray[position],position); return;}
  currentWallet=position;
  incomes=walletsArray[currentWallet].incomes;
  expenses=walletsArray[currentWallet].expenses;
  const content=document.querySelector('#total-div')
  content.style.visibility='visible';
  const incomesElement=document.querySelector('#incomes');
  const expensesElement=document.querySelector('#expenses');
  const titleElement=document.getElementById('currentWallet');
  incomesElement.textContent=incomes;
  expensesElement.textContent=expenses;
  titleElement.textContent=name;
  ChangeVisibility('history')
  ChangeVisibility('widget');
}

function Initialization() {
  
  const wallets = JSON.parse(localStorage.getItem("wallets"));
  const categories = JSON.parse(localStorage.getItem("categories"));
  const history = JSON.parse(localStorage.getItem("history"));
  const aside = document.querySelector(".aside");
  const historyArea = document.querySelector(".history");
  const totalArea= document.querySelector(".total");
  aside.innerHTML += renderWidget("Wallets", wallets,"addWallet");
  aside.innerHTML += renderWidget("Categories", categories,"addCategories");
  historyArea.innerHTML += renderHistory("History", history);
  const addWalletButton = document.querySelector('#addWallets');
  addWalletButton.addEventListener('click', addWallet);
  const addCategoriesButton = document.querySelector('#addCategories');
  addCategoriesButton.addEventListener('click', addCategory);
  const addFundsButton = document.querySelector('#addHistory1');
  const addHistoryButton = document.querySelector('#addHistory2');
  addHistoryButton.addEventListener('click', addHistory);
  addFundsButton.addEventListener('click',addFunds);
  if(wallets) 
  {
    totalArea.innerHTML += renderTotal(wallets[0].name,wallets[0].incomes, wallets[0].expenses);
    ModifyMain(0,wallets[0].name,wallets[0].incomes, wallets[0].expenses,'Wallets');
  }
}


 