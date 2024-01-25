using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;
public class FallbackController : Controller {
	public ActionResult Index() {
		return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
			"wwwroot", "index.html"), "text/HTML");
	}
}