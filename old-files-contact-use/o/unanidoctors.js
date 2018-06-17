
//Copy Right
function copyRight(startYear) {
    date = new Date();
    year = date.getYear();
    if ( (year - startYear) > 0){
       document.write(startYear + " - " + year);
    }else{
     document.write(startYear);
    }
}
