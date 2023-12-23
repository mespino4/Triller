using System.ComponentModel.DataAnnotations.Schema;

namespace api_aspnet.src.Entities;

[Table("Bookmarks")]
public class Bookmark {
	public AppUser User { get; set; }
	public int UserId { get; set; }
	public Trill Trill { get; set; }
	public int TrillId { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.Now;
}