namespace api_aspnet.src.Helpers;

public class MessageParams : PaginationParams{
	public string Username { get; set; }
	public string Container { get; set; } = "Unread";
}
