import { ResolveFn } from '@angular/router';
import { MemberService } from '../_services/member.service';
import { inject } from '@angular/core';
import { Member } from '../_models/member';

export const memberProfileResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService)
  return memberService.getMember(route.paramMap.get('username')!)
};
