using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor

    {
        //These methods interact with Cloudinary, not the app db
        Task<PhotoUploadResult>AddPhoto(IFormFile file);

        Task<string>DeletePhoto(string publicId);

    }
  
}
  