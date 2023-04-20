const addWallet = () => {
    const id = 'walletFormModal';
    renderFormModal(id, walletInputs, submitNewWallet, () => closeModal(id) );
}
  
const addCategory = () => {
    const id = 'categoryFormModal';
      renderFormModal(id, categoryInputs, submitNewCategory, () => closeModal(id))
}

const submitNewWallet = (formData) => {
    currentOption.style.border='none';
    defaultOption.style.border='2px solid black'
    currentOptionSymbol.parentNode.style.border='none';
    defaultOptionSymbol.parentNode.style.border='2px solid black'
    const iconId=currentOptionSymbol.classList[1];
    const { walletName, walletAmount, walletPassword }=formData
    const walletData = {
      name: walletName.value ,
      balance: walletAmount.value,
      password: walletPassword.value,
      icon: "fa-solid " + iconId,
      color: currentOption.style.backgroundColor,
      incomes: parseInt(walletAmount.value),
      expenses: 0
    }
    currentOption=defaultOption;
    currentOptionSymbol=defaultOptionSymbol;
    if(walletName.value=="" || !(walletAmount.value>=0) || NameAlreadyExists(walletName.value)) return;
    if(walletData.password!="") {walletData.name+="🔐";}
    const newWallet = renderWidgetItems('Wallets',[walletData]);
    const widget = document.querySelector("#widgetWallets");
    widget.innerHTML += newWallet;
    const id = 'historyFormModal';
    const isCreated = !!document.querySelector(`#${id}`);
    if(isCreated) {
      const option=document.createElement('option');
      option.value=walletData.name;
      option.textContent=walletData.name;
      const selectWallet=document.querySelector('.selectWallet');
      selectWallet.appendChild(option);
    }
    updateWalletStorage(walletData);
    const totalAreaDiv=!!document.querySelector('#total-div');
    if(!totalAreaDiv) 
    {
        const totalArea= document.querySelector(".total");
        totalArea.innerHTML+=renderTotal(walletData.name,walletData.incomes,walletData.expenses)
    }
    ModifyMain(1,walletData.name,walletData.incomes,walletData.expenses,'Wallets')
}
  
const submitNewCategory = (formData) => {
    currentOption.style.border='none';
    defaultOption.style.border='2px solid black'
    currentOptionSymbol.parentNode.style.border='none';
    defaultOptionSymbol.parentNode.style.border='2px solid black'
    const iconId=currentOptionSymbol.classList[1];
    const positionWal=formData[1].selectedIndex;
    const { categoryName }=formData
    const categoryData = {
      name: categoryName.value ,
      balance: 0,
      icon: "fa-solid "+iconId,
      wallet: positionWal,
      color: currentOption.style.backgroundColor,
    }
    currentOption=defaultOption;
    currentOptionSymbol=defaultOptionSymbol;
    if(categoryName.value=="") return;
    const newCategory = renderWidgetItems('Categories',[categoryData]);
    const widget = document.querySelector("#widgetCategories");
    widget.innerHTML += newCategory;
    const id = 'historyFormModal';
    const isCreated = !!document.querySelector(`#${id}`);
    if(isCreated) {
      const option=document.createElement('option');
      option.value=categoryData.name;
      option.textContent=categoryData.name;
      const selectCategory=document.querySelector('.selectCategory');
      selectCategory.appendChild(option);
    }
    const current = localStorage.getItem('wallets');
    let walletsArray=[];
    if(current) 
        walletsArray = JSON.parse(current);
    if(walletsArray[positionWal].password=="") 
        ModifyMain(0,walletsArray[positionWal].name);
    else 
        ModifyMain(1,walletsArray[positionWal].name);
    updateCategoryStorage(categoryData);
}
const renderFormModal = (id, content, onSubmit, onClose) => {
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

    if(id=='categoryFormModal')
    {
      const selectLabel = document.createElement('label'); 
      selectLabel.textContent='Select a wallet'
      const selectWallet=document.createElement('select');
      selectWallet.classList.add('selectwallets');
      form.append(selectLabel,selectWallet);
      AddOptionsToForm(selectWallet,'wallets');
    }
    
    SelectIconColor(form);
    SelectIconSymbol(form);
    
    ///Submit
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

    //close
    const closeButton = document.createElement("button");
    closeButton.classList.add('close')
    closeButton.classList.add('fa-solid')
    closeButton.classList.add('fa-xmark');
    closeButton.classList.add('fa-2xs');
    closeButton.addEventListener("click", onClose);
    formContainer.append(closeButton);
    document.body.append(formContainer);
}

const renderWidget = (title, items) => {
    const renderedItems = renderWidgetItems(title,items);
    const content = `
    <div class="widget">
    <div class="widget-header">
    <h2>${title}</h2>
    <i id="add${title}">+</i>
    </div>  
      <ul id="widget${title}" class="widget-item-container">
          ${renderedItems}
      </ul>
  </div>
`;
    return content;
}

const renderWidgetItems = (title,items) => {
    if(!items) return "";
    if(title=='Wallets') {
    return items.reduce((acc, { icon, color,name, balance, incomes, expenses }) => {
      return (
        acc + `<li>
        <div class="widget-item" onclick="ModifyMain(0,'${name}','${incomes}','${expenses}','${title}')">
            <i class="${icon}" style="background-color:${color}"></i>
            <div class="widget-item-text">
            <div class="widget-item-name">${name}</div>
            <div class="widget-item-balance">${balance}</div>
        </div>
    </li>`
      ); 
    }, "");
  }
  return items.reduce((acc, { icon, color,name, balance, incomes, expenses,wallet }) => {
    return (
      acc + `<li class="widget${wallet}" style="display:none">
      <div class="widget-item">
          <i class="${icon}" style="background-color:${color}"></i>
          <div class="widget-item-text">
          <div class="widget-item-name">${name}</div>
          <div class="widget-item-balance">${balance}</div>
      </div>
  </li>`
    ); 
  }, "");

}

function SelectIconColor(form)
{
    const ColorLabel=document.createElement('label'); 
    ColorLabel.textContent="Icon Background";
    form.appendChild(ColorLabel);
    const boxSection=document.createElement('div');
    boxSection.classList.add('box-section');
    form.appendChild(boxSection);

    IconColors.forEach((color) =>{
        const box=document.createElement('div');
        box.classList.add('box');
        box.style.backgroundColor=color;
        boxSection.appendChild(box);
        if(color=="rgba(240, 126, 185, 0.6)")
            {
                box.style.border='2px solid black';
                currentOption=box; 
                defaultOption=box;
            }
    });

    boxSection.addEventListener('click', (e)=>{
        if(e.target.parentNode==boxSection && e.target!=currentOption)
        {
            currentOption.style.border='none';
            e.target.style.border='2px solid black';
            currentOption=e.target;
        }
    });
}

function SelectIconSymbol(form)
{
    const SymbolLabel=document.createElement('label'); 
    SymbolLabel.textContent="Icon Symbol";
    form.appendChild(SymbolLabel);
    const symbolSection=document.createElement('div');
    symbolSection.classList.add('symbol-section');
    form.appendChild(symbolSection);

    IconSymbols.forEach((symbol) =>{
      const box=document.createElement('div');
      box.setAttribute('id',symbol);
      box.classList.add("symbol");
      const symbolInt=document.createElement('i');
      symbolInt.classList.add("fa-solid");
      symbolInt.classList.add(symbol);
      symbolInt.classList.add("fa-xl");
      symbolInt.style.backgroundColor="transparent";
      box.appendChild(symbolInt);
      symbolSection.appendChild(box);
      if(symbol=="fa-wallet")
      {
        box.style.border='2px solid black';
        currentOptionSymbol=symbolInt; 
        defaultOptionSymbol=symbolInt;
      }
      
    });
   
    symbolSection.addEventListener('click', (e)=>{
        if(e.target.parentNode.parentNode==symbolSection && e.target!=currentOptionSymbol)
        {
          currentOptionSymbol.parentNode.style.border='none';
          e.target.parentNode.style.border='2px solid black';
          currentOptionSymbol=e.target;
        }
    });

}

function NameAlreadyExists(name)
{
    const currentWallets = localStorage.getItem('wallets');
    let walletsArray=[];
    if(currentWallets) walletsArray = JSON.parse(currentWallets);
    for(let i=0; i<walletsArray.length; i++)
       if(walletsArray[i].name==name)
          return 1;
    return 0;
}