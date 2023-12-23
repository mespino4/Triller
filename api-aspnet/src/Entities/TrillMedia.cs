namespace api_aspnet.src.Entities;

public class TrillMedia {
	public int Id { get; set; }
	public string Url { get; set; }
	public string PublicId { get; set; }
	public Trill Trill { get; set; }
	public int TrillId { get; set; }
}