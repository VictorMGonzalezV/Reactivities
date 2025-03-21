using Microsoft.AspNetCore.Mvc;

namespace Application.Photos
{
    public class PhotoUploadResult
    {
        public string PublicId { get; set; }

        public string Url { get; set; }
    }
}