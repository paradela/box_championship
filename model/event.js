/**
 * Created by Ricardo on 15/08/2016.
 */


exports.createEvent = function(competition_id, name, type, exercises, rounds, timecap, result) {
  var event = {
    name : name,
    type : type,
    /*{
     unity: KG Male,
     qtd: 80
     }*/
    exercises : exercises,
    rounds : rounds,
    timecap : timecap,
    classifications : []
  };
};

