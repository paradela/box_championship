/**
 * Created by Ricardo on 15/08/2016.
 */

exports.createTeam = function(competition_id, name, team_leader, result) {
  var team = {
    name : name,
    team_leader_id : team_leader._id,
    members : [team_leader._id],
    competition_id : competition_id
  }
};