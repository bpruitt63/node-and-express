const numToWord = {0: 'oh', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
                6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 
                11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 
                15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 
                19: 'nineteen', 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty'}

function timeWord(time){

    if (time === "00:00") return "midnight";
    if (time === "12:00") return "noon";

    let hour = parseInt(time.slice(0, 2));
    let min = time.slice(3);
    let ampm = "am"

    if (hour === 12){
        ampm = "pm"
    }
    if (hour === 0){
        hour = 12;
    }
    if (hour > 12){
        hour = hour - 12;
        ampm = "pm"
    }
    hour = numToWord[hour];

    if (min === '00'){
        min = "o'clock";
    } else if ((min[1] === '0') || (min[0] === '1')){
        min = parseInt(min);
        min = numToWord[min];
    } else {
        let min0 = min[0] + "0";
        min0 = parseInt(min0);
        const min1 = parseInt(min[1]);
        min = `${numToWord[min0]} ${numToWord[min1]}`;
    }

    return `${hour} ${min} ${ampm}`
}

module.exports = timeWord