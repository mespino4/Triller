using System.Diagnostics.CodeAnalysis;

namespace api_aspnet.src.DTOs;

public record CreateMessageDTO(
    string RecipientUsername,
    string Content
    );