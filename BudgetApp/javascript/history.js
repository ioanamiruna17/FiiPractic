const addHistory=()=>{
    const ul=document.querySelector('#widgetCategories');
    const li=!!ul.querySelector("li");
    if(!li) return;
    const id = 'historyFormModal';
    renderFormHisotry(id, historyInputs, submitNewHistory, () => closeModal(id))
  }

const addFunds=()=>{
    const id = 'FundsFormModal';
    renderFormNewFunds(id, fundsInputs, submitNewFunds, () => closeModal(id))
}

const submitNewHistory = (formData) => {

    const positionWal=formData[2].selectedIndex;
    let positionCat=formData[3].selectedIndex;
    if(formData[3].options[formData[3].selectedIndex]==null) return;
    const nameCategory=formData[3].options[formData[3].selectedIndex].text;   
    const walletStorage = localStorage.getItem('wallets');
    const walletArray = JSON.parse(walletStorage);
    const categoryStorage = localStorage.getItem('categories');
    const categoryArray = JSON.parse(categoryStorage);

    for(let i=0; i<categoryArray.length; i++)
        if(categoryArray[i].wallet==positionWal && categoryArray[i].name==nameCategory)
            {positionCat=i;break;}

    const { historyName, historyAmount}=formData
    const historyData = {
        name: historyName.value ,
        balance: historyAmount.value,
        icon: categoryArray[positionCat].icon,
        color: categoryArray[positionCat].color,
        value: -1,
        wallet: positionWal,
        category: positionCat
    }

    if(historyName.value=="" || !(historyData.balance>0) || parseInt(walletArray[positionWal].balance)<historyAmount.value) return;

    const newhistory = renderHistoryItems([historyData],-1);
    HistoryArray.push(historyData);
    const widget = document.querySelector("#widgetHistory");
    widget.innerHTML += newhistory;
    updateAside(historyData,'Wallets',positionWal,-1);
    updateAside(historyData,'Categories',positionCat,1);
    updateHistoryStorage(historyData);
}

const submitNewFunds = (formData) => {
    const positionWal=formData[2].selectedIndex;
    const { historyName, historyAmount}=formData
    const historyData = {
        name: historyName.value ,
        balance: historyAmount.value,
        icon: "fa-solid fa-piggy-bank",
        value: 1, 
        wallet: positionWal
    }

    if(historyName.value=="" || !(historyData.balance>0)) return;

    const newhistory = renderHistoryItems([historyData],1);
    HistoryArray.push(historyData);
    const widget = document.querySelector("#widgetHistory");
    widget.innerHTML += newhistory;
    updateAside(historyData,'Wallets',positionWal,1);
    updateHistoryStorage(historyData);
}

const renderFormHisotry = (id, content, onSubmit, onClose) => {
    const form = document.createElement('form');
    content.forEach((inputElement) => {
      const { id, name, type, label, placeholder } = inputElement;
      const input = document.createElement('input');
      input.setAttribute("autocomplete","off");
      input.id = id; 
      input.name = name; 
      input.type = type; 
      input.placeholder = placeholder;
      const inputLabel = document.createElement('label'); 
      inputLabel.for = id; 
      inputLabel.textContent = label;
      form.append(inputLabel, input);
    });
    const selectWallet=document.createElement('select');
    selectWallet.classList.add('selectwallets');
    const selectCategory=document.createElement('select');
    selectCategory.classList.add('selectcategories');
    const selectLabel1 = document.createElement('label'); 
    selectLabel1.textContent='Wallet'
    const selectLabel2 = document.createElement('label'); 
    selectLabel2.textContent='Category'
    form.append(selectLabel1,selectWallet);
    form.append(selectLabel2,selectCategory);
    AddOptionsToForm(selectWallet,'wallets');
    AddOptionsToForm(selectCategory,'categories',0)
    selectWallet.onchange=function()
    {
      selectCategory.innerHTML='';
      AddOptionsToForm(selectCategory,'categories',selectWallet.selectedIndex)
     
    }
    
    const submitButton = document.createElement('button'); 
    submitButton.classList.add('add');
    submitButton.textContent = 'Done';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(e.target.elements);  
      e.target.reset();
      onClose();
    });
    form.append(submitButton); 
    const formContainer = document.createElement('dialog');
    formContainer.classList.add('form__modal');
    formContainer.classList.add('visible'); 
    formContainer.append(form); 
    formContainer.id = id;
    const closeButton = document.createElement("button");
    closeButton.classList.add('close')
    closeButton.classList.add('fa-solid')
     closeButton.classList.add('fa-xmark');
     closeButton.classList.add('fa-2xs');
    closeButton.addEventListener("click", onClose);
    formContainer.append(closeButton);
    document.body.append(formContainer);
  }

const renderFormNewFunds = (id, content, onSubmit, onClose) => {
    const form = document.createElement('form');
    content.forEach((inputElement) => {
      const { id, name, type, label, placeholder } = inputElement;
      const input = document.createElement('input');
      input.setAttribute("autocomplete","off");
      input.id = id; 
      input.name = name; 
      input.type = type; 
      input.placeholder = placeholder;
      const inputLabel = document.createElement('label'); 
      inputLabel.for = id; 
      inputLabel.textContent = label;
      form.append(inputLabel, input);
    });
    const selectLabel = document.createElement('label'); 
    selectLabel.textContent='Wallet'
    const selectWallet=document.createElement('select');
    selectWallet.classList.add('selectwallets');
    form.append(selectLabel,selectWallet);
    AddOptionsToForm(selectWallet,'wallets');
   
    const submitButton = document.createElement('button'); 
    submitButton.classList.add('add');
    submitButton.textContent = 'Done';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(e.target.elements);
      e.target.reset();
      onClose();
    });
    form.append(submitButton); 

    const formContainer = document.createElement('dialog');
    formContainer.classList.add('form__modal');
    formContainer.classList.add('visible'); 
    formContainer.append(form); 
    formContainer.id = id;
    const closeButton = document.createElement("button");
    closeButton.classList.add('close')
    closeButton.classList.add('fa-solid')
    closeButton.classList.add('fa-xmark');
    closeButton.classList.add('fa-2xs');
    closeButton.addEventListener("click", onClose);
    formContainer.append(closeButton);
    document.body.append(formContainer);
  }

const renderHistory = (title, items) => {
    const renderedItems = renderHistoryItems(items);
    const content = 
        `<h1>${title}</h1>
          <ul id="widgetHistory" class="history-item-container">
              ${renderedItems}
          </ul>`;
    return content;
}

const renderHistoryItems=(items)=>{
    if(items==null) return "";
    return items.reduce((acc, {icon,color,name,value,balance,wallet }) => {
        return (
        acc + DrawHistoryItem(icon,color,name,balance,value,wallet)
        );
    }, "");
}

function DrawHistoryItem(icon,color,name,balance,value,wallet)
{
    if(value==-1) 
        line=`<h2 style="color:#e6143e">-${balance}</h2>`
        else 
        line=`<h2 style="color:#219653">+${balance}</h2>`
    const ElementToInsert=
    `<li class="history${wallet}" style="display:none">
        <div class="history-item" >
        <div class="history-items-details">
            <i class="${icon}" style="background-color:${color}"></i>
            <div class="widget-item-text">
                <div class="widget-item-name">${name}</div>
            </div>
        </div>
        <div class="history-item-buttons">
                ${line}
                <i class="fa-solid fa-trash" onClick="DeleteElement(this)"></i>
        </div>
        </div>
    </li>`;
    return ElementToInsert;
}

const renderTotal=(name,incomes,expenses) =>{
        const content=`
        <div id="total-div" style="visibility:hidden">
        <h1 id="currentWallet">${name}</h1>
        <div class="total-item-container">
        <div class="total-item">
        <i class="fa-solid fa-arrow-trend-up"></i>
        <div class="total-item-text">
        <p><b>Total Incomes</b></p>
        <p id="incomes">${incomes}</p>
        </div>
        </div>
        <div class="total-item">
        <i class="fa-solid fa-arrow-trend-down"></i>
        <div class="total-item-text">
        <p><b>Total Expenses</b></p>
        <p id="expenses">${expenses}</p>
        </div>
        </div>
        </div>
        </div>
        `
    return content;
}