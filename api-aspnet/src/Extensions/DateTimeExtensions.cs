namespace api_aspnet.src.Extensions;

// This is an extension method for the DateOnly struct,
// which calculates a person's age based on their date of birth.
public static class DateTimeExtensions {
	// CalculateAge method takes a DateOnly object as input and returns the person's age as an integer.
	public static int CalculateAge(this DateOnly dob) {
		// Get the current date as a DateOnly object.
		var today = DateOnly.FromDateTime(DateTime.Now);

		// Calculate the age by subtracting the birth year from the current year.
		var age = today.Year - dob.Year;

		// Check if the birthdate for this year has already occurred.
		// If not, decrement the age by 1 to account for this.
		if(dob > today.AddYears(-age)) {
			age--;
		}

		// Return the calculated age as an integer.
		return age;
	}
}