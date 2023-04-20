function OpenWalletWithPassword(walletArray,index)
  {
    const id ='PasswordFormModal';
    if(position!=currentWallet) renderFormPassword(id,walletArray,index,submitPassword, () => closeModal(id))
    else submitPassword(walletArray,position,walletArray.password,walletArray.password)
}

function renderFormPassword (id, walletArray, position,onSubmit, onClose) {
    
    const form = document.createElement('form');
    const label=document.createElement('label');
    const input=document.createElement('input');
    label.textContent="Enter the password for "+walletArray.name;
    input.type = 'password';
    form.append(label,input);
    const formContainer = document.createElement('dialog');
    formContainer.classList.add('form__modal');
    formContainer.classList.add('visible'); 
    formContainer.append(form); 
    formContainer.id = id;
   
    //Submit
    const submitButton = document.createElement('button'); 
    submitButton.classList.add('add');
    submitButton.textContent = 'Done';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(walletArray,position,e.target.elements[0].value,walletArray.password);
      e.target.reset();
      onClose();
    });
    form.append(submitButton); 

    //Close
    const closeButton = document.createElement("button");
    closeButton.classList.add('close')
    closeButton.classList.add('fa-solid')
    closeButton.classList.add('fa-xmark');
    closeButton.classList.add('fa-2xs');
    closeButton.addEventListener("click", onClose);
    formContainer.append(closeButton);
    document.body.append(formContainer);
}

function submitPassword(walletArray,index,pwd,correctPassword)
  {
    if(pwd==correctPassword)
    {
      currentWallet=index;
    
      ChangeVisibility('history')
      ChangeVisibility('widget');

      //change total area
      const content=document.querySelector('#total-div')
      content.style.visibility='visible';
      const incomes=document.querySelector('#incomes');
      const expenses=document.querySelector('#expenses');
      const title=document.getElementById('currentWallet');
      incomes.textContent=walletArray.incomes;
      expenses.textContent=walletArray.expenses;
      title.textContent=walletArray.name;

    }
}