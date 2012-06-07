var app     = require('../app');
var http    = require('http');

describe('test', function () {
    it('should pass', function () {
        var errorSpy    = jasmine.createSpy();
        var successSpy  = jasmine.createSpy();
        var flag        = false;

        runs(function () {
            app.listen(3000, function () {
                http.get({host: '127.0.0.1', port: 3000, path: '/' }, function (res) {
                    successSpy();
                    flag = true;
                }).on('error', function (e) {
                    errorSpy();
                    flag = true;
                });
            });
        });

        waitsFor(function () {
            return flag;
        }, 'The get call should have completed', 500);

        runs(function () {
            app.close();
            expect(successSpy).toHaveBeenCalled();
            expect(errorSpy).not.toHaveBeenCalled();
        });
    });
});
