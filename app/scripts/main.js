var db = new Firebase('https://secret-santa.firebaseio.com/');

var event_id = $.cookie('event_id');
var my_event = null;
var participants = [];
var event_form_is_dirty = false;

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
    // Shuffle the participants.
    var keys = _.shuffle(_.keys(participants));
    var last_i = keys.length - 1;
    console.log('participants shuffled', keys);

    // Print the matches.
    // Use a simple cycle graph to match the participants.
    var output_div = $('#messagesDiv');
    output_div.empty();
    for (var i = 0; i < last_i; i++) { // note: excluding last index
        $('<p>' + participants[keys[i]].name + '\'s secret santa is ' + participants[keys[i+1]].name + '</p>').appendTo(output_div);
    }
    $('<p>' + participants[keys[last_i]].name + '\'s secret santa is ' + participants[keys[0]].name + '</p>').appendTo(output_div);
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
    if (!event_form_is_dirty) {
        $('form#event [name="oname"]').val(event_data['oname']);
        $('form#event [name="email"]').val(event_data['email']);
        $('form#event [name="ename"]').val(event_data['ename']);
        $('form#event [name="date"]').val(event_data['date']);
        $('form#event [name="max-amount"]').val(event_data['max-amount']);
        $('form#event [name="edescription"]').val(event_data['edescription']);
    }

    // Load the participants.
    participants = _.toArray(event_data.participants);
    console.log('Loaded participants', participants);
    matchPartipants();
});

// Mark the event form as "dirty" if a field changes.
$('form#event').find('input,textarea').on('change', function() {
    event_form_is_dirty = true;
});

// Handle event form.
$('form#event').on('submit', function(e) {
    e.preventDefault();

    // Check that DB has been loaded.
    if (my_event === null) {
        alert('Event data not yet loaded from database!');
        return false;
    }

    // Disable the form while saving.
    $('#eSubmit').prop('disabled', true);

    // Remove "dirty" flag.
    event_form_is_dirty = false;

    // Save the event and show an alert message when done.
    var data = getFormFields(this);
    my_event.update(data, function(err) {
        // Re-enable the event form.
        $('#eSubmit').prop('disabled', false);

        // Print a notification message.
        var msg = $('<span class="alert"></span>').css({ marginLeft: '15px' });
        if (err === null) {
            msg.text('Saved!').addClass('alert-success');
        } else {
            msg.text('Error: Could not save event.').addClass('alert-danger');
        }
        msg.insertAfter('#eSubmit').fadeOut(5000);
    });
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
