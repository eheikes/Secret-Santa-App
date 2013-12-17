var db = new Firebase('https://secret-santa.firebaseio.com/');

var event_id = $.cookie('event_id');
var my_event = null;
var participants = [];

// Helper func to convert form DOM fields to hash.
var getFormFields = function(form) {
    return _.object(
        _.map(
            $(form).serializeArray(),
            function(x) { return [x.name, x.value]; }
        )
    );
};

// Match up participants with each other.
var matchPartipants = function() {
    // TODO do a cycle, not pairs
    var output_div = $('#messagesDiv');
    var keys = _.shuffle(_.keys(participants));
    console.log('participants shuffled', keys);
    output_div.empty();
    while (keys.length >= 2) {
        var i = keys.pop();
        var j = keys.pop();
        $('<p>' + participants[i].name + ' <=> ' + participants[j].name + '</p>').appendTo(output_div);
    }
    if (keys.length > 0) {
        // TODO
    }
};

// No session cookie? Create it and the DB key.
if (typeof event_id === 'undefined') {
    my_event = db.push({oname: 'Secret Santa', participants: ''}); // dummy data
    // my_event.push({participants: {}});
    event_id = my_event.name();
    $.cookie('event_id', event_id, { expires: 365 });
}
console.log('Event ID is ' + event_id);

// Load the event from the DB.
db.once('value', function(snapshot) {
    var event_data = snapshot.val()[event_id];
    my_event = db.child(event_id); // snapshot doesn't have methods
    console.log('Loaded event from DB', event_data);

    // Prefill the event form.
    // TODO check if the form has been "dirtied" first
    $('form#event input[name="oname"]').val(event_data['oname']);
    $('form#event input[name="email"]').val(event_data['email']);
    $('form#event input[name="ename"]').val(event_data['ename']);
    $('form#event input[name="date"]').val(event_data['date']);
    $('form#event input[name="max-amount"]').val(event_data['max-amount']);
    $('form#event input[name="edescription"]').val(event_data['edescription']);

    // Load the participants.
    participants = _.toArray(event_data.participants);
    console.log('Loaded participants', participants);
    matchPartipants();
});

// Handle event form.
$('form#event').on('submit', function(e) {
    // TODO disable btn, show alert message when done
    e.preventDefault();
    if (my_event === null) {
        alert('Event data not loaded from Firebase!');
        return false;
    }
    var data = getFormFields(this);
    my_event.update(data);
});

// Handle the participant form.
$('form#participant').on('submit', function(e) {
    e.preventDefault();
    var data = getFormFields(this);

    // Add the data to the DB and our local array.
    my_event.child('participants').push(data);
    participants.push(data);
    console.log('Participants is now:', participants);

    // Clear out the form.
    $(this).find('input').each(function() {
        $(this).val('');
    });

    // Update the matches.
    matchPartipants();
});
