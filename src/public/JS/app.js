

//UI Tasks 
class UI {
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.patients-list');
        const form = document.querySelector('#patient-form');
        container.insertBefore(div, form);

        //vanish

        setTimeout(() => document.querySelector('.alert').remove(), 800);
    }
}


document.querySelector('.btn-primary').addEventListener('submit', (e) =>{
    e.preventDefault();

    UI.showAlert('Patient Added', 'success');
    

});

document.querySelector('.delete').addEventListener('click', (e) =>{
    
    UI.showAlert('Patient Removed', 'danger')
   
})

    

