using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace Livefeed.Api.SignalR
{
    public class LiveFeedHub : Hub
	{
		public async Task BroadcastGroup(string groupId, LiveFeedPayload payload) =>
			Clients.OthersInGroup(groupId).onBroadcastGroup(payload);

		public async Task JoinGroup(string groupId) =>
            await Groups.Add(Context.ConnectionId, groupId);

		public async Task LeaveGroup(string groupId)
		{
			try
			{
				await Groups.Remove(Context.ConnectionId, groupId);
			}
			catch
			{
				// TaskCanceledException may occur
			}
		}
	}
}