using CloudinaryDotNet.Actions;


namespace api_aspnet.src.Services.Interfaces;
public interface IMediaService {
	Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
	Task<VideoUploadResult> AddVideoAsync(IFormFile file);
	Task<DeletionResult> DeleteMediaAsync(string publicId);
}
