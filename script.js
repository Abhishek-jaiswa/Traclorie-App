class CalorieTracker {
    constructor(){
        this._caloriesLimit = Storage.getCalorieLimit();
        this._totalCalories =Storage.getTotalCalorie(0);
        this._meal = Storage.getMeals();
        this._workouts = Storage.getWorkouts();
        this._displayCalorieLimit();
        this._displayCalorieTotal();
        this._displayCalorieConsumed();
        this._displayCalorieBurned();
        this._displayCalorieRemain();
        this._displayCalorieProgress()
      
    }

    // Public methods
    addMeal(meal){
        this._meal.push(meal);
        this._totalCalories  += meal.calories;
        Storage.updateTotalCalorie(this._totalCalories);
        Storage.saveMeals(meal);
        this._displayMealItem(meal);
        this._render();
    }

    addWorkouts(workouts){
        this._workouts.push(workouts)
        this._totalCalories -= workouts.calories;
        Storage.updateTotalCalorie(this._totalCalories);
        Storage.saveWorkouts(workouts);
        this._displayWorkoutItem(workouts);
        this._render();
        
    }

    removeMeal(id){
        const index = this._meal.findIndex((meal) => meal.id === id);
        if(index !== -1){
            const meal = this._meal[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalorie(this._totalCalories);
            this._meal.splice(index, 1);
            Storage.removeMeals(id)
            this._render()

        }

    }

    removeWorkout(id){
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if(index !== -1){
            const workout = this._workouts[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalorie(this._totalCalories);
            this._workouts.splice(index, 1);
            Storage.removeWorkouts(id);
            this._render()

        }

    }
    reset() {
        this._totalCalories =0;
        this._meal = [];
        this._workouts =[];
        Storage.clearAll();
        this._render()
    }

    setLimit(calorieLimit){
        this._caloriesLimit =calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCalorieLimit();
        this._render();

    }

    loadItems(){
        this._meal.forEach((meal) => {
            this._displayMealItem(meal)
        })

        this._workouts.forEach((workout) => {
            this._displayWorkoutItem(workout)
        })
    }

    // Private Methods

    _displayCalorieTotal(){
        const totalCalorieEl = document.querySelector('.gain-loss');
        totalCalorieEl.innerHTML = this._totalCalories
    }

    _displayCalorieLimit(){
        const calorieLimitEl = document.querySelector('.calories-limit');
        calorieLimitEl.innerHTML = this._caloriesLimit
    }

    _displayCalorieConsumed(){
        const calorieConsumedEl = document.querySelector('.calorie-consumed');
        const  consumed = this._meal.reduce((total, meal) =>{
            return total + meal.calories
        },0)

        calorieConsumedEl.innerHTML = consumed;
    }

    _displayCalorieBurned(){
        const calorieBurnedEl = document.querySelector('.calorie-burned');
        const burned = this._workouts.reduce((total, workout) =>{
            return total + workout.calories
        },0)
    
        calorieBurnedEl.innerHTML = burned;
    }

    _displayCalorieRemain(){
        const calorieRemainEl = document.querySelector('.calorie-remained');
        const remain = this._caloriesLimit - this._totalCalories;
        calorieRemainEl.innerHTML = remain;

        const progressEl = document.querySelector('.progress-bar');
        if(remain <= 0){
        calorieRemainEl.parentElement.parentElement.classList.remove('bg-light');
        calorieRemainEl.parentElement.parentElement.classList.add('bg-danger');
        progressEl.classList.remove('bg-success');
        progressEl.classList.add('bg-danger')
        }
        else{
            calorieRemainEl.parentElement.parentElement.classList.remove('bg-danger');
            calorieRemainEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success')
        }
    }

    _displayCalorieProgress(){
        const progressEl = document.querySelector('.progress-bar');
        const percentage  = (this._totalCalories / this._caloriesLimit) * 100

        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`
    }

    _displayMealItem(meal){
        const mealList = document.querySelector('.meal-items');
        const item = document.createElement('div');
        item.className = `card card-body my-2`;
        item.setAttribute('data-id', meal.id)
        item.innerHTML = `
         <div class="d-flex justify-content-between align-items-center">
                  <h4 mx-1>${meal.name}</h4>
                  <div
                    class="fs-1 green-btn text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2 Xmark">X</button>
                </div>
        `
        mealList.appendChild(item);
        
    }

    _displayWorkoutItem(workout){
        const workoutList = document.querySelector('.workout-items');
        const item = document.createElement('div');
        item.className = `card card-body my-2`;
        item.setAttribute('data-id', workout.id)
        item.innerHTML = `
         <div class="d-flex justify-content-between align-items-center">
                  <h4 mx-1>${workout.name}</h4>
                  <div
                    class="fs-1 orange-btn text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2 Xmark">X</button>
                </div>
        `
        workoutList.appendChild(item);

        // document.querySelector('.workout-items').addEventListener('click', function(e){
        //     if(e.target.innerHTML === 'X'){
        //         // console.log(e.target.previousElementSibling)
        //         e.target.parentElement.parentElement.remove()
        //     } 
        // })
        
    }

    _render(){
        this._displayCalorieTotal();
        this._displayCalorieConsumed();
        this._displayCalorieBurned();
        this._displayCalorieRemain();
        this._displayCalorieProgress()
    }
}

class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name;
        this.calories = calories
    }
}

class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name;
        this.calories = calories
    }
}

class Storage{
    static getCalorieLimit(defaultLimit = 2000){
        let calorieLimit;
        if(localStorage.getItem('calorieLimit') === null){
            calorieLimit =defaultLimit;
        }else{
            calorieLimit = +localStorage.getItem('calorieLimit')
        }

        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit){
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalorie(defaultCalorie = 0){
        let totalCalorie;
        if(localStorage.getItem('totalCalorie') === null){
            totalCalorie =defaultCalorie;
        }else{
            totalCalorie = +localStorage.getItem('totalCalorie')
        }

        return totalCalorie;
    }

    static updateTotalCalorie(calories){
        localStorage.setItem('totalCalorie', calories)
    }

    static getMeals(){
        let meals;
        if(localStorage.getItem('meals') === null){
            meals =[];
        }else{
            meals = JSON.parse(localStorage.getItem('meals'))
        }

        return meals;
    }

    static saveMeals(meal){
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals))

    }

    static removeMeals(id){
        const meals = Storage.getMeals();
        meals.forEach((meal, index) => {
            if(meal.id === id){
                meals.splice(index, 1);

            }
        });
        localStorage.setItem('meals', JSON.stringify(meals))
    }

    static getWorkouts(){
        let workouts;
        if(localStorage.getItem('workouts') === null){
            workouts =[];
        }else{
            workouts = JSON.parse(localStorage.getItem('workouts'))
        }

        return workouts;
    }

    static saveWorkouts(workout){
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts))

    }

    static removeWorkouts(id){
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if(workout.id === id){
                workouts.splice(index, 1);

            }
        });
        localStorage.setItem('workouts', JSON.stringify(workouts))
    }

    static clearAll(){
        localStorage.removeItem('totalCalorie');
        localStorage.removeItem('meals');
        localStorage.removeItem('workouts')
    }
}


class App{
    constructor(){
        this._tracker = new CalorieTracker();

        document.querySelector('#meal-form').addEventListener('submit',this._newMeal.bind(this));

        document.querySelector('#workout-form').addEventListener('submit', this._newWorkout.bind(this));

        document.querySelector('.meal-items').addEventListener('click',this._removeItem.bind(this, 'meal'));

        document.querySelector('.workout-items').addEventListener('click',this._removeItem.bind(this, 'workout'));

        document.querySelector('#filter-meal').addEventListener('keyup', this._filterItem.bind(this, 'meal'))

        document.querySelector('#filter-workout').addEventListener('keyup', this._filterItem.bind(this, 'workout'))

        document.querySelector('#reset').addEventListener('click', this._reset.bind(this))

        document.querySelector('#limit-form').addEventListener('submit', this._dailyLimit.bind(this));

        this._tracker.loadItems()


    }
    _newMeal(e){
        e.preventDefault();
        const name = document.querySelector('#meal-name');
        const calorie = document.querySelector('#meal-calorie');

        if(name.value === '' || calorie.value === ''){
            alert('Please enter value');
            return
        }
        if(isNaN(calorie.value)){
            alert('PLease enter calorie in Numbers');
            return;
        }
        const meal = new Meal(name.value, parseInt(calorie.value.trim()));
        this._tracker.addMeal(meal);

        name.value = '';
        calorie.value = '';

        const collapseMeal = document.querySelector('#collapse-meal');
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle : true
        });
        
        

    }

    _newWorkout(e){
        e.preventDefault();
        const name = document.querySelector('#workout-name');
        const calorie = document.querySelector('#workout-calorie');

        if(name.value === '' || calorie.value === ''){
            alert('Please enter value');
            return;

        }
        if(isNaN(calorie.value)){
            alert('Please enter calorie in Numbers');
            return;

        }

        const workout = new Workout(name.value, parseInt(calorie.value.trim()));;

        this._tracker.addWorkouts(workout);
        name.value = '';
        calorie.value = '';

        const collapseWorkout = document.querySelector('#collapse-workout');
        const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
            toggle : true
        })


    }

    _removeItem( type, e){
        if(e.target.classList.contains('delete') && e.target.classList.contains('Xmark')){
            if(confirm('Are you sure?')){
                const id = e.target.closest('.card').getAttribute('data-id');

               type === 'meal'
               ?this._tracker.removeMeal(id)
               :this._tracker.removeWorkout(id);
                e.target.closest('.card').remove()
            }
        }
    }


    _filterItem(type, e){
    const text = e.target.value.toLowerCase();
    document.querySelectorAll(`.${type}-items .card`).forEach((item) => {
        const name =item.firstElementChild.firstElementChild.textContent;

       
        if(name.toLowerCase().indexOf(text) !== -1){
            item.style.display ='block';
             item.style.borderColor ='red';
           
        }else{
            item.style.display = 'none';
            
        }
        if(text === ''){
            item.style.borderColor ='lightgray'
       }

    })

    }

    _reset(){
        this._tracker.reset();
        document.querySelector('.meal-items').innerHTML ='';
        document.querySelector('.workout-items').innerHTML ='';
        document.querySelector('#filter-meal').innerHTML ='';
        document.querySelector('#filter-workout').innerHTML ='';
    }

    _dailyLimit(e){
        e.preventDefault()
        const text = document.querySelector('#limit');

        if(limit.value === ''){
            alert('Please add a limit');
            return
        }

        this._tracker.setLimit(limit.value);
        limit.value = '';

        const  modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide()
        

    }
}

const app = new App()
