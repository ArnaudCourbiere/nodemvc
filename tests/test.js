var foo = function (string, callback) {
    if (string.length != 0) {
        console.log('true');
    } else {
        console.log('false')
    }
    
    //console.log(arguments);
};

foo(function () {});