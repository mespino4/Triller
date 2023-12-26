using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;
[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase {}