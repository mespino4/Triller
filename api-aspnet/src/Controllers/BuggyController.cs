﻿using api_aspnet.src.Data;
using api_aspnet.src.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api_aspnet.src.Controllers;
[ApiController]
public class BuggyController(DataContext context) : BaseApiController {
	private readonly DataContext _context = context;

    [Authorize]
	[HttpGet("auth")]
	public ActionResult<string> GetSecret() {
		return "secret text";
	}

	[HttpGet("not-found")]
	public ActionResult<AppUser> GetNotFound() {
		var thing = _context.Users.Find(-1);
		if(thing == null) return NotFound();

		return thing;
	}

	[HttpGet("server-error")]
	public ActionResult<string> GetServerError() {
		var thing = _context.Users.Find(-1);
		var thingToReturn = thing.ToString();

		return thingToReturn;
	}


	[HttpGet("bad-request")]
	public ActionResult<string> GetBadRequest() {
		return BadRequest("This was not a good request");
	}

}