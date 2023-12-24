using api_aspnet.src.Data;
using api_aspnet.src.Services.Interfaces;
using Microsoft.Extensions.Options;

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using api_aspnet.src.Helpers;

namespace api_aspnet.src.Services;

public class MediaService : IMediaService{

	private readonly Cloudinary _cloudinary;

	public MediaService(IOptions<CloudinarySettings> config, DataContext context) {
		var acc = new Account(
			config.Value.CloudName,
			config.Value.ApiKey,
			config.Value.ApiSecret
			);

		_cloudinary = new Cloudinary(acc);
	}
	public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file) {
		var uploadResult = new ImageUploadResult();

		if(file.Length > 0) {
			using var stream = file.OpenReadStream();
			var uploadParams = new ImageUploadParams {
				File = new FileDescription(file.FileName, stream),
				Folder = "Triller"
			};
			uploadResult = await _cloudinary.UploadAsync(uploadParams);
		}

		return uploadResult;
	}

	public async Task<VideoUploadResult> AddVideoAsync(IFormFile file) {
		var uploadResult = new VideoUploadResult();

		if(file.Length > 0) {
			using var stream = file.OpenReadStream();
			var uploadParams = new VideoUploadParams {
				File = new FileDescription(file.FileName, stream),
				Folder = "Triller"
			};
			uploadResult = await _cloudinary.UploadAsync(uploadParams);
		}
		return uploadResult;
	}

	public async Task<DeletionResult> DeleteMediaAsync(string publicId) {
		var deleteParams = new DeletionParams(publicId);
		return await _cloudinary.DestroyAsync(deleteParams);
	}
}
