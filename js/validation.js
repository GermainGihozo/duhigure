// FAMILY FORM VALIDATION
function validateFamilyForm() {

    let familyName = document.getElementById("familyName").value.trim();
    let headName   = document.getElementById("headName").value.trim();
    let nid        = document.getElementById("nid").value.trim();
    let phone      = document.getElementById("phone").value.trim();
    let sector     = document.getElementById("sector").value;

    if (familyName === "" || headName === "" || nid === "" || phone === "" || sector === "") {
        alert("All fields are required!");
        return false;
    }

    if (nid.length !== 16) {
        alert("National ID must contain 16 digits.");
        return false;
    }

    if (phone.length < 10) {
        alert("Phone number must be at least 10 digits.");
        return false;
    }

    alert("Family registered successfully!");
    return true;
}


// FAMILY MEMBER VALIDATION
function validateMemberForm() {

    let name     = document.getElementById("memberName").value.trim();
    let relation = document.getElementById("relation").value;
    let age      = document.getElementById("age").value;
    let role     = document.getElementById("role").value.trim();

    if (name === "" || relation === "" || age === "" || role === "") {
        alert("Please fill all member details.");
        return false;
    }

    if (age <= 0) {
        alert("Age must be greater than zero.");
        return false;
    }

    alert("Family member added successfully!");
    return true;
}
